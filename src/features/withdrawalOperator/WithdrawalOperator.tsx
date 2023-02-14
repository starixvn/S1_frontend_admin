import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useExportWithdrawalListMutation,
	useLazyGetWithdrawalListQuery,
} from 'features/withdrawalOperator/api'
import {
	useGetBankCodeListQuery,
	useGetCalCodeListQuery,
	useGetVipLevelEnumBySiteIdQuery,
} from 'common/service/baseDataApi'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { WithdrawalOperatorFilter } from 'features/withdrawalOperator/WithdrawalOperatorFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useEffect, useState } from 'react'
import { filter, head, includes, isEmpty } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { AllSiteId, IFilterForm } from 'features/withdrawalOperator/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { WithdrawalOperatorTable } from 'features/withdrawalOperator/WithdrawalOperatorTable'
import download from 'downloadjs'
import moment from 'moment/moment'
import { WithdrawalOperatorOverviewTable } from 'features/withdrawalOperator/WithdrawalOperatorOverviewTable'
import { CalCodePurposeEnum } from 'common/service/baseDataApi/type'

const WithdrawalOperator = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [filterForm] = Form.useForm<IFilterForm>()

	const { siteId: originSiteId } = useAppSelector(selectUserSite) ?? {}
	const formIsAllSite = Form.useWatch('isAllSite', filterForm)
	const siteId = formIsAllSite ? AllSiteId : originSiteId

	const [queryParams, setQueryParams] = useQueryParams()
	const formCurrencyIds = Form.useWatch('currencyIds', filterForm)
	const [collapseActiveKey, setCollapseActiveKey] = useState<number>(1)

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
	} = useGetVipLevelEnumBySiteIdQuery({ siteId })

	const {
		data: { data: calCodeList = [] } = {},
		isLoading: isGetCalCodeLoading,
	} = useGetCalCodeListQuery({
		siteId,
		purpose: CalCodePurposeEnum.Withdrawal,
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
		const {
			startDate,
			endDate,
			startAmount,
			endAmount,
			userName = '',
			withdrawalId,
			withdrawalMethod = 0,
			withdrawalTypes,
			statuses,
			currencyIds = [],
			levelStatuses,
			selectBankCode,
			selectCalCode,
			agent = '',
		} = queryParams

		try {
			const blob = await exportWithdrawalList({
				startDate,
				endDate,
				siteId,
				startAmount: Number(startAmount) || -1,
				endAmount: Number(endAmount) || -1,
				userName,
				withdrawalId: withdrawalId || null,
				withdrawalMethod: Number(withdrawalMethod),
				withdrawalTypes:
					withdrawalTypes?.map((type: string) => Number(type)) ?? [],
				statuses: statuses?.map((status: string) => Number(status)) ?? [],
				currencyIds:
					currencyIds?.map((currencyId: string) => Number(currencyId)) ?? [],
				levelStatuses:
					levelStatuses?.map((status: string) => Number(status)) ?? [],
				selectBankCode:
					selectBankCode?.map((bankCode: string) => Number(bankCode)) ?? [],
				selectCalCode:
					selectCalCode?.map((calCode: string) => Number(calCode)) ?? [],
				agent,
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
			setCollapseActiveKey(0)
			// init Query
			const {
				isAllSite = false,
				startDate,
				endDate,
				startAmount,
				endAmount,
				withdrawalId = '',
				agent = '',
				pageNumber,
				pageSize,
				timeZone,
				currencyIds = [],
				statuses = [],
				selectCalCode = [],
				levelStatuses = [],
				selectBankCode = [],
				withdrawalTypes = [],
				withdrawalMethod,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				isAllSite,
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
				currentTimeZoneUtcOffset: Number(timeZone),
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

	useEffect(() => {
		if (formIsAllSite) {
			// * 當 isAllSite = true, 下列條件接設定為 '全選' 的狀態
			filterForm.setFieldsValue({
				currencyIds: [],
				withdrawalMethod: 0,
				levelStatuses: [],
				userName: '',
				withdrawalId: '',
				startAmount: 0,
				endAmount: 0,
				agent: '',
				selectCalCode: [],
				selectBankCode: [],
			})
		}
	}, [formIsAllSite])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalOperatorFilter
				isAllSite={formIsAllSite}
				loading={filterLoading}
				form={filterForm}
				collapseActiveKey={collapseActiveKey}
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
				setCollapseActiveKey={setCollapseActiveKey}
			/>
			{!isEmpty(queryParams) && (
				<WithdrawalOperatorTable
					isAllSite={queryParams?.isAllSite}
					loading={isGetWithdrawalLoading}
					withdrawalList={withdrawalList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
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
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportWithdrawalListLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WithdrawalOperator
