import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useExportWithdrawalListMutation,
	useGetBankCodeListQuery,
	useGetCalCodeLisQuery,
	useGetVipLevelListQuery,
	useLazyGetWithdrawalListQuery,
} from 'features/withdrawalOperator/api'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { WithdrawalOperatorFilter } from 'features/withdrawalOperator/WithdrawalOperatorFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useEffect } from 'react'
import { filter, head, includes, isEmpty } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { IFilterForm } from 'features/withdrawalOperator/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { WithdrawalOperatorTable } from 'features/withdrawalOperator/WithdrawalOperatorTable'
import download from 'downloadjs'
import moment from 'moment/moment'
import { WithdrawalOperatorOverviewTable } from 'features/withdrawalOperator/WithdrawalOperatorOverviewTable'

const WithdrawalOperator = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { actionPermissions: { exportExcelPermission, editPermission } = {} } =
		useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const formCurrencyIds = Form.useWatch('currencyIds', filterForm)

	const [
		getWithdrawalList,
		{
			data: {
				data: withdrawalList = [],
				currencyAmountRecord: currencyAmountData = [],
				rowCount: withdrawalListTotal = 0,
			} = {},
			isFetching: isGetWithdrawalLoading,
		},
	] = useLazyGetWithdrawalListQuery({
		pollingInterval: 15000,
	})

	const [pagination, setPagination] = usePagination({
		paginationTotal: withdrawalListTotal,
	})

	const [exportWithdrawalList, { isLoading: isExportWithdrawalListLoading }] =
		useExportWithdrawalListMutation()

	const {
		data: { data: withdrawalMethodList = [] } = {},
		isLoading: isGetWithdrawalMethodLoading,
	} = useGetEnumTypeQuery({ enumName: 'WithdrawalMethodEnum' })

	const {
		data: { data: withdrawalStatusList = [] } = {},
		isLoading: isGetWithdrawalStatusLoading,
	} = useGetEnumTypeQuery({ enumName: 'WithdrawalStatusEnum' })

	const {
		data: { data: withdrawalTypeList = [] } = {},
		isLoading: isGetWithdrawalTypeLoading,
	} = useGetEnumTypeQuery({ enumName: 'WithdrawalTypeEnum' })

	const {
		data: { data: vipLevelList = [] } = {},
		isLoading: isGetVipLevelListLoading,
	} = useGetVipLevelListQuery({ siteId })

	const {
		data: { data: calCodeList = [] } = {},
		isLoading: isGetCalCodeLoading,
	} = useGetCalCodeLisQuery({
		siteId,
	})

	const {
		data: { data: bankCodeList = [] } = {},
		isLoading: isGetBankCodeListLoading,
	} = useGetBankCodeListQuery({
		siteId,
		currency: 0, // 帶 0 取全部
	})

	const filteredBankCodeListByCurrencyIds = filter(
		bankCodeList,
		({ currencyId }) => includes(formCurrencyIds, currencyId)
	)

	const filterCalCodeListByBankCode = filter(calCodeList, ({ currencyId }) =>
		includes(formCurrencyIds, currencyId)
	)

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, startAmount, endAmount, withdrawalId, ...restValue } =
			filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			await getWithdrawalList({
				startDate,
				endDate,
				siteId,
				startAmount: startAmount || -1,
				endAmount: endAmount || -1,
				withdrawalId: withdrawalId || null,
				pageNumber: current,
				pageSize,
				...restValue,
			}).unwrap()
			setQueryParams({
				startDate,
				endDate,
				startAmount,
				endAmount,
				withdrawalId,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
				...restValue,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleExport = async () => {
		const { dateRange, startAmount, endAmount, withdrawalId, ...restValue } =
			filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			const blob = await exportWithdrawalList({
				startDate,
				endDate,
				siteId,
				startAmount: startAmount || -1,
				endAmount: endAmount || -1,
				withdrawalId: withdrawalId || null,
				...restValue,
			}).unwrap()
			download(
				blob,
				`WithdrawalOperatorReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isGetWithdrawalMethodLoading ||
		isGetWithdrawalStatusLoading ||
		isGetWithdrawalTypeLoading ||
		isGetVipLevelListLoading ||
		isGetCalCodeLoading ||
		isGetBankCodeListLoading

	useEffect(() => {
		if (!filterLoading && !isEmpty(queryParams)) {
			// init Query
			const {
				startDate,
				endDate,
				startAmount,
				endAmount,
				withdrawalId = '',
				agent = '',
				pageNumber,
				pageSize,
				timeZone,
				currencyIds,
				statuses = [],
				selectCalCode = [],
				levelStatuses = [],
				selectBankCode = [],
				withdrawalTypes = [],
				withdrawalMethod,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				withdrawalId,
				agent,
				dateRange: [moment(startDate), moment(endDate)],
				startAmount: startAmount || null,
				endAmount: endAmount || null,
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				statuses: statuses.map((status: string) => Number(status)),
				selectCalCode: selectCalCode.map((code: string) => Number(code)),
				levelStatuses: levelStatuses.map((status: string) => Number(status)),
				selectBankCode: selectBankCode.map((code: string) => Number(code)),
				withdrawalTypes: withdrawalTypes.map((type: string) => Number(type)),
				withdrawalMethod:
					Number(withdrawalMethod) || head(withdrawalMethodList)?.value,
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		} else if (!filterLoading) {
			// filter Init
			filterForm.setFieldsValue({
				statuses: withdrawalStatusList?.map(({ value }) => value),
				withdrawalTypes: withdrawalTypeList?.map(({ value }) => value),
				withdrawalMethod: head(withdrawalMethodList)?.value,
				levelStatuses: vipLevelList?.map(({ level }) => level),
			})
		}
	}, [filterLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalOperatorFilter
				loading={filterLoading}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				withdrawalMethodList={withdrawalMethodList}
				withdrawalStatusList={withdrawalStatusList}
				vipLevelList={vipLevelList}
				calCodeList={filterCalCodeListByBankCode}
				currencyListBySite={currencyListBySite}
				withdrawalTypeList={withdrawalTypeList}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
				bankCodeList={filteredBankCodeListByCurrencyIds}
			/>
			{!isEmpty(queryParams) && (
				<WithdrawalOperatorTable
					loading={isGetWithdrawalLoading}
					withdrawalList={withdrawalList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					editPermission={editPermission}
					onTableChange={handleTableChange}
				/>
			)}
			{currencyAmountData?.length > 0 && (
				<WithdrawalOperatorOverviewTable
					loading={isGetWithdrawalLoading}
					currencyAmountData={currencyAmountData}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportWithdrawalListLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WithdrawalOperator
