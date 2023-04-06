import moment from 'moment'
import { useEffect } from 'react'
import download from 'downloadjs'
import { isEmpty, omit } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { SorterResult } from 'antd/es/table/interface'
import { message, TablePaginationConfig } from 'antd'
import { selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { orderDirectionConverter } from 'features/betList/converter'
import { OrderByTypeEnum } from 'features/betList/type'
import {
	IMarketingDepositSignUpUrlSummaryData,
	IMarketingDepositSummaryData,
	IMarketingDepositSignUpDetailData,
} from 'features/marketing/type'
import {
	useGetMarketingDepositSummaryDataQuery,
	useGetMarketingDepositSignUpUrlSummaryDataQuery,
	useLazyGetMarketingDepositSignUpUrlDetailListQuery,
	useExportMarketingDepositReportMutation,
} from 'features/marketing/depositAmount/api'
import MarketingTableLayout from 'features/marketing/MarketingTableLayout'
import DepositSummaryTable from 'features/marketing/depositAmount/table/DepositSummaryTable'
import DepositSignUpUrlSummaryTable from 'features/marketing/depositAmount/table/DepositSignUpUrlSummaryTable'
import DepositSignUpDetailTable from 'features/marketing/depositAmount/table/DepositSignUpDetailTable'

const DepositAmount = () => {
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
		// Deposit Amount 預設
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
		currencyIds: currencyIds
			? currencyIds?.map((value: string) => Number(value))
			: [],
		baseCurrencyId: Number(baseCurrencyId),
		isCompared: Boolean(isCompared),
		timezone: Number(timezone),
		orderBy: Boolean(orderBy),
		orderByProperty,
		orderByDirection: Number(orderByDirection),
	}

	const {
		data: {
			data: marketingDepositSummaryData = {} as IMarketingDepositSummaryData,
		} = {},
		isFetching: isMarketingDepositSummaryFetching,
	} = useGetMarketingDepositSummaryDataQuery(
		omit(queryData, ['isCompared', 'timezone']),
		{
			skip: isEmpty(queryParams),
		}
	)

	const {
		data: {
			data: marketingDepositSignUpUrlSummaryData = {} as IMarketingDepositSignUpUrlSummaryData,
		} = {},
		isFetching: isMarketingDepositSignUpUrlSummaryFetching,
	} = useGetMarketingDepositSignUpUrlSummaryDataQuery(
		omit(queryData, ['isCompared', 'timezone']),
		{
			skip: isEmpty(queryParams),
		}
	)

	const [
		getMarketingDepositSignUpUrlDetailList,
		{
			data: {
				data: marketingDepositSignUpDetailList = [],
				rowCount: marketingDepositSignUpDetailTotal = 0,
			} = {},
			isFetching: isMarketingDepositSignUpDetailFetching,
		},
	] = useLazyGetMarketingDepositSignUpUrlDetailListQuery()

	const [exportMarketingDepositReport] =
		useExportMarketingDepositReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: marketingDepositSignUpDetailTotal,
	})

	// 因有 sort & page 所以用 lazyQuery 處理 MarketingDepositSignUpUrlDetail Api
	const fetchMarketingDepositSignUpUrlDetail = async ({
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
			await getMarketingDepositSignUpUrlDetailList(args).unwrap()
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
			await fetchMarketingDepositSignUpUrlDetail({
				orderByProp: true,
				orderByPropertyProp: sorter.field as string,
				orderByDirectionProp: orderDirectionConverter(sorter.order as string),
				current,
				pageSize,
			})
		} else {
			await fetchMarketingDepositSignUpUrlDetail({
				current,
				pageSize,
			})
		}
	}

	const handleExport = async () => {
		if (!siteId) return

		try {
			const blob = await exportMarketingDepositReport(
				omit(queryData, ['timezone'])
			).unwrap()
			download(
				blob,
				`MarketingReport_DepositAmount_${moment().format(
					'YYYYMMDDHHmmss'
				)}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	// 因GetMarketingDepositSignUpUrlDetail 用 lazyQuery 需進行第一次初次渲染
	useEffect(() => {
		const init = () => {
			fetchMarketingDepositSignUpUrlDetail({})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_DepositAmount')} />
			<MarketingTableLayout>
				{/* Summary */}
				<MarketingTableLayout.Summary
					hasQueryParams={!isEmpty(queryParams)}
					exportExcelPermission={exportExcelPermission}
					onExportClick={handleExport}
					// title 欄位需要參數
					title={t('Label_DepositAmount')}
					baseCurrencyId={Number(baseCurrencyId)}
					startDate={startDate}
					endDate={endDate}
				>
					<DepositSummaryTable
						loading={isMarketingDepositSummaryFetching}
						marketingDepositSummaryData={marketingDepositSummaryData}
					/>
					<DepositSignUpUrlSummaryTable
						loading={isMarketingDepositSignUpUrlSummaryFetching}
						marketingDepositSignUpUrlSummaryData={
							marketingDepositSignUpUrlSummaryData
						}
					/>
				</MarketingTableLayout.Summary>
				{/* Detail */}
				<MarketingTableLayout.Detail>
					<DepositSignUpDetailTable
						loading={isMarketingDepositSignUpDetailFetching}
						pagination={pagination}
						timezone={timezone}
						marketingDepositSignUpDetailList={marketingDepositSignUpDetailList}
						onTableChange={handleTableChange}
					/>
				</MarketingTableLayout.Detail>
			</MarketingTableLayout>
		</LayoutContent.Main>
	)
}

export default DepositAmount
