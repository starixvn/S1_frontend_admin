import moment from 'moment'
import { isEmpty, omit } from 'lodash'
import { useEffect } from 'react'
import download from 'downloadjs'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
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
import MarketingTableLayout from 'features/marketing/MarketingTableLayout'
import NruSummaryReportTable from 'features/marketing/nru/table/NruSummaryReportTable'
import NruReportTable from 'features/marketing/nru/table/NruReportTable'
import NruBonusReportTable from 'features/marketing/nru/table/NruBonusReportTable'
import NruBonusDetailTable from 'features/marketing/nru/table/NruBonusDetailTable'
import {
	IMarketingDepositSignUpDetailData,
	IMarketingNruReportData,
} from 'features/marketing/type'
import {
	useGetMarketingNruReportQuery,
	useGetMarketingNruBonusReportQuery,
	useLazyGetMarketingNruBonusDetailReportQuery,
	useExportMarketingNruReportMutation,
} from 'features/marketing/nru/api'

const Nru = () => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()

	const {
		startDate,
		endDate,
		comparedStartDate,
		comparedEndDate,
		currencyIds = [],
		baseCurrencyId = 0,
		isCompared = false,
		timezone = timeZoneUtcOffset,
		// NRU Amount 預設
		orderBy = true,
		orderByProperty = 'bonusCode',
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
		data: { data: marketingNruReportData = {} as IMarketingNruReportData } = {},
		isFetching: isMarketingNruReportFetching,
	} = useGetMarketingNruReportQuery(
		omit(queryData, [
			'orderBy',
			'orderByProperty',
			'orderByDirection',
			'timezone',
		]),
		{
			skip: isEmpty(queryParams),
		}
	)

	const {
		data: { data: marketingNruBonusReportData = [] } = {},
		isFetching: isMarketingNruBonusReportFetching,
	} = useGetMarketingNruBonusReportQuery(
		omit(queryData, [
			'orderBy',
			'orderByProperty',
			'orderByDirection',
			'isCompared',
			'comparedStartDate',
			'comparedEndDate',
			'timezone',
		]),
		{
			skip: isEmpty(queryParams),
		}
	)

	const [
		getMarketingNruBonusDetailReportList,
		{
			data: {
				data: marketingNruBonusDetailReportList = [],
				rowCount: marketingNruBonusDetailDetailReportTotal = 0,
			} = {},
			isFetching: isMarketingNruBonusReportDetailFetching,
		},
	] = useLazyGetMarketingNruBonusDetailReportQuery()

	const [exportMarketingNruReport] = useExportMarketingNruReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: marketingNruBonusDetailDetailReportTotal,
	})

	// 因有 sort & page 所以用 lazyQuery 處理 MarketingNruBonusDetailReport Api
	const fetchMarketingNruBonusDetailReport = async ({
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
			await getMarketingNruBonusDetailReportList(args).unwrap()
			// 與 queryData 保持一致 補上在初次選染遺失的 isCompared,comparedStartDate,comparedEndDate
			setQueryParams({
				...args,
				comparedStartDate,
				comparedEndDate,
				isCompared,
			})
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
			await fetchMarketingNruBonusDetailReport({
				orderByProp: true,
				orderByPropertyProp: sorter.field as string,
				orderByDirectionProp: orderDirectionConverter(sorter.order as string),
				current,
				pageSize,
			})
		} else {
			await fetchMarketingNruBonusDetailReport({
				current,
				pageSize,
			})
		}
	}

	const handleExport = async () => {
		if (!siteId) return

		try {
			const blob = await exportMarketingNruReport(
				omit(queryData, ['timezone'])
			).unwrap()
			download(
				blob,
				`MarketingReport_NewlyRegisterUsers_${moment().format('YYYYMMDD')}.xlsx`
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
			fetchMarketingNruBonusDetailReport({})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_NewlyRegisteredUsers')} />
			<MarketingTableLayout>
				<MarketingTableLayout.Summary
					hasQueryParams={!isEmpty(queryParams)}
					exportExcelPermission={exportExcelPermission}
					onExportClick={handleExport}
					// title 欄位需要參數
					title={t('Label_NewlyRegisteredUsers')}
					baseCurrencyId={Number(baseCurrencyId)}
					startDate={startDate}
					endDate={endDate}
				>
					<NruSummaryReportTable
						loading={isMarketingNruReportFetching}
						marketingNruReportData={marketingNruReportData}
					/>
					<NruReportTable
						loading={isMarketingNruReportFetching}
						marketingNruReportData={marketingNruReportData}
					/>
					<NruBonusReportTable
						loading={isMarketingNruBonusReportFetching}
						marketingNruBonusReportData={marketingNruBonusReportData}
					/>
				</MarketingTableLayout.Summary>
				<MarketingTableLayout.Detail>
					<NruBonusDetailTable
						loading={isMarketingNruBonusReportDetailFetching}
						pagination={pagination}
						timeZoneUtcOffset={timeZoneUtcOffset}
						marketingNruBonusDetailReportList={
							marketingNruBonusDetailReportList
						}
						onTableChange={handleTableChange}
					/>
				</MarketingTableLayout.Detail>
			</MarketingTableLayout>
		</LayoutContent.Main>
	)
}

export default Nru
