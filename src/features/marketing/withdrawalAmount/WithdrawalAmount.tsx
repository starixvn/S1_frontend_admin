import moment from 'moment'
import { isEmpty } from 'lodash'
import download from 'downloadjs'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { message, TablePaginationConfig } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { useTimeZone } from 'components/TimeZoneSelect'
import { selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { OrderByTypeEnum } from 'features/betList/type'
import { orderDirectionConverter } from 'features/betList/converter'
import MpaMarketingTableLayout from 'features/marketing/MarketingTableLayout'
import WithdrawalSummaryTable from 'features/marketing/withdrawalAmount/table/WithdrawalSummaryTable'
import WithdrawalDetailTable from 'features/marketing/withdrawalAmount/table/WithdrawalDetailTable'
import {
	IMarketingDepositSignUpDetailData,
	IMarketingWithdrawalSummaryData,
} from 'features/marketing/type'
import {
	useGetMarketingWithdrawalSummaryQuery,
	useLazyGetMarketingWithdrawalDetailQuery,
	useExportMarketingWithdrawalReportMutation,
} from 'features/marketing/withdrawalAmount/api'

const WithdrawalAmount = () => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()

	const {
		startDate,
		endDate,
		comparedStartDate,
		comparedEndDate,
		currencyIds = [],
		baseCurrencyId = 0,
		isCompared = false,
		timezone = timeZoneUtcOffset,
		// Withdrawal Amount 預設
		orderBy = false,
		orderByProperty = '',
		orderByDirection = OrderByTypeEnum.ascend as number,
	} = queryParams

	const queryData = {
		siteId,
		startDate,
		endDate,
		comparedStartDate,
		comparedEndDate,
		currencyIds: currencyIds.map((value: string) => Number(value)),
		baseCurrencyId: Number(baseCurrencyId),
		isCompared: Boolean(isCompared),
		timezone: Number(timezone),
		orderBy: Boolean(orderBy),
		orderByProperty,
		orderByDirection: Number(orderByDirection),
	}

	const {
		isCompared: removeIsCompared,
		timezone: deleteTimeZone,
		...newQueryData
	} = queryData

	const {
		data: {
			data: mpaMarketingWithdrawalSummaryData = {} as IMarketingWithdrawalSummaryData,
		} = {},
		isFetching: isMpaMarketingWithdrawalSummaryFetching,
	} = useGetMarketingWithdrawalSummaryQuery(newQueryData, {
		skip: isEmpty(queryParams),
	})

	const [
		getMpaMarketingWithdrawalDetailList,
		{
			data: {
				data: mpaMarketingWithdrawalDetailList = [],
				rowCount: mapMarketingWithdrawalDetailTotal = 0,
			} = {},
			isFetching: isMpaMarketingWithdrawalDetailFetching,
		},
	] = useLazyGetMarketingWithdrawalDetailQuery()

	const [exportMpaMarketingWithdrawalReport] =
		useExportMarketingWithdrawalReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: mapMarketingWithdrawalDetailTotal,
	})

	// 因有 sort & page 所以用 lazyQuery 處理 MpaMarketingWithdrawalDetail Api
	const fetchMpaMarketingWithdrawalDetail = async ({
		orderByProp = false,
		orderByPropertyProp = '',
		orderByDirectionProp = OrderByTypeEnum.ascend as number,
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		orderByProp?: boolean
		orderByPropertyProp?: string
		orderByDirectionProp?: number
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		// 加 isEmpty(queryParams) 判斷是防止 渲染空table時在 使用者做 sort 排序
		if (!siteId || isEmpty(queryParams)) return

		const args = {
			siteId,
			startDate,
			endDate,
			comparedStartDate,
			comparedEndDate,
			currencyIds: currencyIds
				? currencyIds?.map((value: string) => Number(value))
				: [],
			orderBy: orderByProp,
			orderByProperty: orderByPropertyProp,
			orderByDirection: orderByDirectionProp,
			baseCurrencyId: Number(baseCurrencyId),
			pageSize,
			pageNumber: current,
		}

		try {
			await getMpaMarketingWithdrawalDetailList(args).unwrap()
			// 與 queryData 保持一致 補上在初次選染遺失的 isCompared
			// isCompared 只有在 Export 中用到
			setQueryParams({ ...args, isCompared })
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IMarketingDepositSignUpDetailData>
	) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		if (sorter.order) {
			await fetchMpaMarketingWithdrawalDetail({
				orderByProp: true,
				orderByPropertyProp: sorter.field as string,
				orderByDirectionProp: orderDirectionConverter(sorter.order as string),
				current,
				pageSize,
			})
		} else {
			await fetchMpaMarketingWithdrawalDetail({
				current,
				pageSize,
			})
		}
	}

	const handleExport = async () => {
		if (!siteId) return

		const { timezone: removeTimeZone, ...exportQueryData } = queryData
		try {
			const blob = await exportMpaMarketingWithdrawalReport(
				exportQueryData
			).unwrap()
			download(
				blob,
				`MarketingReport_WithdrawalAmount_${moment().format('YYYYMMDD')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	//  因GetMpaMarketingWithdrawalDetail 用 lazyQuery 需進行第一次初次渲染
	useEffect(() => {
		const init = () => {
			fetchMpaMarketingWithdrawalDetail({})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_WithdrawalAmount')} />

			<MpaMarketingTableLayout>
				{/* Summary */}
				<MpaMarketingTableLayout.Summary
					onExportClick={handleExport}
					exportExcelPermission={exportExcelPermission}
					hasQueryParams={!isEmpty(queryParams)}
				>
					<WithdrawalSummaryTable
						loading={isMpaMarketingWithdrawalSummaryFetching}
						marketingWithdrawalSummaryData={mpaMarketingWithdrawalSummaryData}
					/>
				</MpaMarketingTableLayout.Summary>
				{/* Detail */}
				<MpaMarketingTableLayout.Detail>
					<WithdrawalDetailTable
						loading={isMpaMarketingWithdrawalDetailFetching}
						pagination={pagination}
						timeZone={timezone}
						marketingWithdrawalDetailList={mpaMarketingWithdrawalDetailList}
						onTableChange={handleTableChange}
					/>
				</MpaMarketingTableLayout.Detail>
			</MpaMarketingTableLayout>
		</LayoutContent.Main>
	)
}

export default WithdrawalAmount
