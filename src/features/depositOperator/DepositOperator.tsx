import moment from 'moment'
import download from 'downloadjs'
import React, { Key, useEffect, useState } from 'react'
import { filter, includes, isEmpty, isNumber, map, reduce } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Form, message, PageHeader, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { DepositTypeEnum } from 'type'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { SiteIds } from 'app/constants/siteIds'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useGetPayEnumListQuery } from 'common/service/allDataApi'
import {
	useGetBankCodeListQuery,
	useGetCalCodeListQuery,
	useGetVipLevelEnumBySiteIdQuery,
} from 'common/service/baseDataApi'
import {
	CalCodePurposeEnum,
	IBankCodeResponse,
} from 'common/service/baseDataApi/type'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useLazyGetDepositOperatorListQuery,
	useBatchRejectedDepositTransIdsMutation,
	useExportDepositMutation,
} from 'features/depositOperator/api'
import { DepositStatusEnum, IForm } from 'features/depositOperator/type'
import { DateTypeEnum } from 'features/depositOperator/constants'
import { AffixButtons } from 'components/AffixButtons'
import DepositOperatorFilter from 'features/depositOperator/DepositOperatorFilter'
import DepositOperatorTable from 'features/depositOperator/DepositOperatorTable'
import DepositOperatorOverviewTable from './DepositOperatorOverviewTable'

const DepositOperator = ({ pageTitle = '' }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm<IForm>()

	const {
		actionPermissions: { exportExcelPermission, rejectPermission } = {},
	} = useAuth()

	const { siteId: originSiteId } = useAppSelector(selectUserSite) ?? {}
	const formIsAllSite = Form.useWatch('isAllSite', form)
	const siteId = formIsAllSite ? SiteIds.All : originSiteId

	const [queryParams, setQueryParams] = useQueryParams()

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const formCurrencyIds = Form.useWatch('currencyIds', form)
	const [tableSelectedRowTransIds, setTableSelectedTransIds] = useState<Key[]>(
		[]
	)

	const {
		data: { data: statusesEnum } = {} as IEnumTypeResponse,
		isFetching: isGetStatusesEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'SelectDepositStatusEnum' })

	const {
		data: { data: depositTypeEnum } = {} as IEnumTypeResponse,
		isFetching: isGetDepositTypeEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'DepositTypeEnum' })

	const {
		data: { data: payEnumList = [] } = {},
		isFetching: isGetPayEnumListFetching,
	} = useGetPayEnumListQuery(null)

	const {
		data: { data: bankCodeList = [] } = {} as IBankCodeResponse,
		isFetching: isGetbankCodeListLoading,
	} = useGetBankCodeListQuery({
		siteId,
		currency: 0, // * All
	})

	const {
		data: { data: vipLevelEnum = [] } = {},
		isFetching: isGetVipLevelEnumFetching,
	} = useGetVipLevelEnumBySiteIdQuery({ siteId })

	const { data: calCodeList = [], isFetching: isGetCalCodeListFetching } =
		useGetCalCodeListQuery(
			{
				siteId,
				purpose: CalCodePurposeEnum.Deposit,
			},
			{
				selectFromResult: ({ data: { data } = {}, isFetching }) => {
					const filteredData = filter(data, ({ currencyId }) =>
						includes(formCurrencyIds, currencyId)
					)
					return { data: filteredData, isFetching }
				},
			}
		)

	const isMoreThanThreeDays =
		moment(queryParams.endDate).diff(queryParams.startDate, 's') > 259199

	const [
		getDepositOperatorList,
		{
			data: {
				data: depositOperatorList = [],
				rowCount: DepositOperatorTotal = 0,
				currencyAmountRecord: currencyAmountRecordList = [],
			} = {},
			isFetching: isGetDepositOperatorListFetching,
		},
	] = useLazyGetDepositOperatorListQuery({
		// * 如果超過三天即關閉 pollingInterval
		pollingInterval: isMoreThanThreeDays ? 0 : 15000,
	})

	const [
		batchRejectedDepositTransIds,
		{ isLoading: isBatchRejectedDepositTransIdsLoading },
	] = useBatchRejectedDepositTransIdsMutation()

	const [exportDeposit, { isLoading: isExportDepositLoading }] =
		useExportDepositMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: DepositOperatorTotal,
	})

	const resetSelectedTransIds = () => {
		setTableSelectedTransIds([])
	}

	const handleExport = async () => {
		if (!isNumber(siteId)) return
		const {
			currencyIds = [],
			statuses = [],
			selectPayId = [],
			depositTypes = [],
			selectBankCode = [],
			userName = '',
			depositId = null,
			startAmount = null,
			endAmount = null,
			levelStatuses = [],
			agent = '',
			selectCalCode = [],
			startDate,
			endDate,
			dateType,
		} = queryParams ?? {}
		try {
			const blob = await exportDeposit({
				siteId,
				startDate,
				endDate,
				depositId,
				userName,
				selectBankCode: map(selectBankCode, value => Number(value)) ?? [],
				selectCalCode: map(selectCalCode, value => Number(value)) ?? [],
				selectPayId: map(selectPayId, value => Number(value)) ?? [],
				// * -1 代表不做範圍的限制
				startAmount: startAmount || -1,
				endAmount: endAmount || -1,
				depositTypes: map(depositTypes, value => Number(value)) ?? [],
				statuses: map(statuses, value => Number(value)) ?? [],
				currencyIds: map(currencyIds, value => Number(value)) ?? [],
				levelStatuses: map(levelStatuses, value => Number(value)) ?? [],
				agent,
				dateType: Number(dateType),
			}).unwrap()
			download(
				blob,
				`DepositOperator_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}) => {
		if (!isNumber(originSiteId)) return
		resetSelectedTransIds()

		const {
			dateType,
			isAllSite,
			dateRange,
			selectPayIds,
			startAmount,
			endAmount,
			depositId,
			...rest
		} = form.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		// 259199

		// 用於記錄 Column 下拉選單
		const { visibilityColumns: queryVisibilityColumns = [] } = queryParams

		try {
			await getDepositOperatorList({
				siteId: isAllSite ? SiteIds.All : originSiteId,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				selectPayId: selectPayIds,
				// * -1 代表不做範圍的限制
				startAmount: startAmount || -1,
				endAmount: endAmount || -1,
				depositId: depositId || null,
				dateType,
				...rest,
			}).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
			setQueryParams({
				isAllSite,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				selectPayId: selectPayIds,
				startAmount,
				endAmount,
				depositId: depositId || null,
				dateType,
				...rest,
				timeZone: currentTimeZoneUtcOffset,
				visibilityColumns: !isEmpty(queryVisibilityColumns)
					? queryVisibilityColumns
					: null,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: TablePaginationConfig) => {
		handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleBatchRejectedDepositTransIds = async () => {
		try {
			await batchRejectedDepositTransIds({
				transIds: tableSelectedRowTransIds,
			}).unwrap()
			resetSelectedTransIds()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const enumLoading =
		isGetStatusesEnumLoading ||
		isGetDepositTypeEnumLoading ||
		isGetPayEnumListFetching ||
		isGetbankCodeListLoading ||
		isGetVipLevelEnumFetching ||
		isGetCalCodeListFetching

	useEffect(() => {
		const initSelector = () => {
			form.setFieldsValue({
				currencyIds:
					currencyListBySite?.map(({ currencyId }) => currencyId) ?? [],
				statuses: [DepositStatusEnum.Pending],
				selectPayIds: [],
				selectBankCode: [],
				depositTypes: [DepositTypeEnum.LocalBanking],
				levelStatuses: vipLevelEnum?.map(({ level }) => level),
			})
		}
		if (!enumLoading && isEmpty(queryParams)) {
			initSelector()
		}
	}, [enumLoading])

	useEffect(() => {
		const init = () => {
			const {
				isAllSite = false,
				timeZone,
				currencyIds = [],
				statuses = [],
				selectPayId = [],
				depositTypes = [],
				selectBankCode = [],
				userName = '',
				depositId = null,
				startAmount = null,
				endAmount = null,
				levelStatuses = [],
				agent = '',
				selectCalCode = [],
				pageNumber,
				pageSize,
				startDate,
				endDate,
				dateType = DateTypeEnum.CreateTime,
			} = queryParams ?? {}
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				isAllSite,
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds?.map((value: string) => Number(value)) ?? [],
				statuses: statuses?.map((value: string) => Number(value)) ?? [],
				selectPayIds: selectPayId?.map((value: string) => Number(value)) ?? [],
				depositTypes: depositTypes?.map((value: string) => Number(value)) ?? [],
				selectBankCode:
					selectBankCode?.map((value: string) => Number(value)) ?? [],
				userName,
				depositId,
				startAmount: Number(startAmount),
				endAmount: Number(endAmount),
				levelStatuses:
					levelStatuses?.map((value: string) => Number(value)) ?? [],
				agent,
				selectCalCode:
					selectCalCode?.map((value: string) => Number(value)) ?? [],
				dateType: Number(dateType),
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	useEffect(() => {
		if (formIsAllSite) {
			// * 當 isAllSite = true, 下列條件接設定為 '全選' 的狀態
			form.setFieldsValue({
				currencyIds: [],
				selectPayIds: [],
				selectBankCode: [],
				userName: '',
				depositId: '',
				startAmount: 0,
				endAmount: 0,
				levelStatuses: [],
				agent: '',
				selectCalCode: [],
			})
		}
	}, [formIsAllSite])

	const filteredBankCodeListByCurrencyIds = filter(
		bankCodeList,
		({ currencyId }) => includes(formCurrencyIds, currencyId)
	)

	const hasSelectedRow = tableSelectedRowTransIds.length > 0

	// * 處理多選 checkbox
	const rowSelection = {
		selectedRowKeys: tableSelectedRowTransIds,
		onChange: (newSelectedRowKeys: (string | number)[]) =>
			setTableSelectedTransIds(newSelectedRowKeys),
	}

	const currencyAmountRecordTotal = reduce(
		currencyAmountRecordList,
		(
			{ recordTotal, amountTotal },
			{ record: currentRecord, amount: currentAmount }
		) => {
			return {
				recordTotal: recordTotal + currentRecord,
				amountTotal: amountTotal + currentAmount,
			}
		},
		{
			recordTotal: 0,
			amountTotal: 0,
		}
	)

	return (
		<LayoutContent.Main>
			<PageHeader title={pageTitle} />
			<DepositOperatorFilter
				isAllSite={formIsAllSite}
				form={form}
				loading={isGetDepositOperatorListFetching}
				enumLoading={enumLoading}
				currencyListBySite={currencyListBySite}
				statusesEnum={statusesEnum}
				payEnumList={payEnumList}
				depositTypeEnum={depositTypeEnum}
				bankCodeList={filteredBankCodeListByCurrencyIds}
				vipLevelEnum={vipLevelEnum}
				calCodeList={calCodeList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			<DepositOperatorTable
				isAllSite={queryParams?.isAllSite}
				loading={isGetDepositOperatorListFetching}
				timeZoneUtcOffset={timeZoneUtcOffset}
				depositOperatorList={depositOperatorList}
				pagination={pagination}
				rowSelection={rowSelection}
				onTableChange={handleTableChange}
			/>

			{!isEmpty(currencyAmountRecordList) && (
				<DepositOperatorOverviewTable
					loading={isGetDepositOperatorListFetching}
					currencyAmountRecordList={currencyAmountRecordList}
					currencyAmountRecordTotal={currencyAmountRecordTotal}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Reject
					loading={isBatchRejectedDepositTransIdsLoading}
					disabled={!hasSelectedRow || !rejectPermission?.canUse}
					onClick={handleBatchRejectedDepositTransIds}
				/>
				<AffixButtons.FileExport
					loading={isExportDepositLoading}
					disabled={isEmpty(queryParams) || !exportExcelPermission?.canUse}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositOperator
