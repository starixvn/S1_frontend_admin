import moment from 'moment'
import { find, isEmpty, omit } from 'lodash'
import download from 'downloadjs'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { message, TablePaginationConfig } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { useTimeZone } from 'components/TimeZoneSelect'
import { selectUserSiteList } from 'common/enum'
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

// * 多品牌操作頁面: 送出的 siteId 由 by cookie 改為 by url

const WithdrawalAmount = () => {
	const { t } = useTranslation()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const userSiteList = useAppSelector(selectUserSiteList)
	const isInitRef = useRef(false)

	const {
		siteId,
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

	const { siteName } = find(userSiteList, { siteId: Number(siteId) }) || {}

	const {
		data: {
			data: mpaMarketingWithdrawalSummaryData = {} as IMarketingWithdrawalSummaryData,
		} = {},
		isLoading: isMpaMarketingWithdrawalSummaryLoading,
		isSuccess: isMpaMarketingWithdrawalSummarySuccess,
	} = useGetMarketingWithdrawalSummaryQuery(
		omit(queryData, ['isCompared', 'timezone']),
		{
			// 用isInitRef 監聽 確保 Detail Table 以外的Api不會重打
			skip: isEmpty(queryParams) || isInitRef.current,
		}
	)

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
	const handleGetMpaMarketingWithdrawalDetail = async ({
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
		// 加 isEmpty(queryParams) 判斷是防止 渲染空table時 使用者做 sort 排序
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
			await handleGetMpaMarketingWithdrawalDetail({
				orderByProp: true,
				orderByPropertyProp: sorter.field as string,
				orderByDirectionProp: orderDirectionConverter(sorter.order as string),
				current,
				pageSize,
			})
		} else {
			await handleGetMpaMarketingWithdrawalDetail({
				current,
				pageSize,
			})
		}
	}

	const handleExport = async () => {
		if (!siteId) return

		try {
			const blob = await exportMpaMarketingWithdrawalReport(
				omit(queryData, ['timezone'])
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
			handleGetMpaMarketingWithdrawalDetail({})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	useEffect(() => {
		if (isMpaMarketingWithdrawalSummarySuccess) {
			isInitRef.current = true
		}
	}, [isMpaMarketingWithdrawalSummarySuccess])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				// * 顯示品牌名稱讓使用者知道正在操作哪個品牌
				title={`${t('Label_WithdrawalAmount')} (${siteName})`}
			/>

			<MpaMarketingTableLayout>
				{/* Summary */}
				<MpaMarketingTableLayout.Summary
					hasQueryParams={!isEmpty(queryParams)}
					exportExcelPermission={exportExcelPermission!}
					onExportClick={handleExport}
					// title 欄位需要參數
					title={t('Label_WithdrawalAmount')}
					baseCurrencyId={Number(baseCurrencyId)}
					startDate={startDate}
					endDate={endDate}
				>
					<WithdrawalSummaryTable
						loading={isMpaMarketingWithdrawalSummaryLoading}
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
