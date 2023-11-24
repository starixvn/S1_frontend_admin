import moment from 'moment'
import { find, isEmpty, omit } from 'lodash'
import download from 'downloadjs'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectUserSiteList } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import { SorterResult } from 'antd/es/table/interface'
import { message, TablePaginationConfig } from 'antd'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	useGetMarketingBonusAmountClaimedDataQuery,
	useLazyGetMarketingBonusAmountClaimedDetailListQuery,
	useExportMarketingBonusAmountClaimedReportMutation,
} from 'features/marketing/bonusAmountClaimed/api'
import {
	IBonusAmountClaimedReportData,
	IMarketingDepositSignUpDetailData,
} from 'features/marketing/type'
import { OrderByTypeEnum } from 'features/betList/type'
import { orderDirectionConverter } from 'features/betList/converter'
import MarketingTableLayout from 'features/marketing/MarketingTableLayout'
import BonusAmountClaimedCurrencySumTable from 'features/marketing/bonusAmountClaimed/table/BonusAmountClaimedCurrencySumTable'
import BonusAmountClaimedBonusTable from 'features/marketing/bonusAmountClaimed/table/BonusAmountClaimedBonusTable'
import BonusAmountClaimedDetailTable from 'features/marketing/bonusAmountClaimed/table/BonusAmountClaimedDetailTable'

const BonusAmountClaimed = () => {
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
		// Bonus Amount Claimed 預設
		orderBy = true,
		orderByProperty = 'bonusAmountClaim',
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
			data: marketingBonusAmountClaimedData = {} as IBonusAmountClaimedReportData,
		} = {},
		isLoading: isMarketingBonusAmountClaimedLoading,
		isSuccess: isMarketingBonusAmountClaimedSuccess,
	} = useGetMarketingBonusAmountClaimedDataQuery(
		omit(queryData, [
			'orderBy',
			'orderByProperty',
			'orderByDirection',
			'timezone',
		]),
		{
			// 用isInitRef 監聽 確保 Detail Table 以外的Api不會重打
			skip: isEmpty(queryParams) || isInitRef.current,
		}
	)

	const [
		getMarketingBonusAmountClaimedDetailList,
		{
			data: {
				data: marketingBonusAmountClaimedDetailList = [],
				rowCount: marketingBonusAmountClaimedDetailTotal = 0,
			} = {},
			isFetching: isMarketingBonusAmountClaimedDetailFetching,
		},
	] = useLazyGetMarketingBonusAmountClaimedDetailListQuery()

	const [exportMarketingDepositReport] =
		useExportMarketingBonusAmountClaimedReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: marketingBonusAmountClaimedDetailTotal,
	})

	// 因有 sort & page 所以用 lazyQuery 處理 MarketingBonusAmountClaimedDetail Api
	const handleGetMarketingBonusAmountClaimedDetail = async ({
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
			await getMarketingBonusAmountClaimedDetailList(args).unwrap()
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
			await handleGetMarketingBonusAmountClaimedDetail({
				orderByProp: true,
				orderByPropertyProp: sorter.field as string,
				orderByDirectionProp: orderDirectionConverter(sorter.order as string),
				current,
				pageSize,
			})
		} else {
			await handleGetMarketingBonusAmountClaimedDetail({
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
				`MarketingReport_BonusAmountClaimed_${moment().format('YYYYMMDD')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 因MarketingBonusAmountClaimedDetail 用 lazyQuery 需進行第一次初次渲染
	useEffect(() => {
		const init = () => {
			handleGetMarketingBonusAmountClaimedDetail({})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	useEffect(() => {
		if (isMarketingBonusAmountClaimedSuccess) {
			isInitRef.current = true
		}
	}, [isMarketingBonusAmountClaimedSuccess])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				// * 顯示品牌名稱讓使用者知道正在操作哪個品牌
				title={`${t('Label_BonusAmountClaimed')} (${siteName})`}
			/>

			<MarketingTableLayout>
				<MarketingTableLayout.Summary
					hasQueryParams={!isEmpty(queryParams)}
					exportExcelPermission={exportExcelPermission!}
					onExportClick={handleExport}
					// title 欄位需要參數
					title={t('Label_BonusAmountClaimed')}
					baseCurrencyId={Number(baseCurrencyId)}
					startDate={startDate}
					endDate={endDate}
				>
					<BonusAmountClaimedCurrencySumTable
						loading={isMarketingBonusAmountClaimedLoading}
						marketingBonusAmountClaimedData={marketingBonusAmountClaimedData}
					/>
					<BonusAmountClaimedBonusTable
						loading={isMarketingBonusAmountClaimedLoading}
						marketingBonusAmountClaimedData={marketingBonusAmountClaimedData}
					/>
				</MarketingTableLayout.Summary>
				<MarketingTableLayout.Detail>
					<BonusAmountClaimedDetailTable
						loading={isMarketingBonusAmountClaimedDetailFetching}
						pagination={pagination}
						timezone={timezone}
						marketingBonusAmountClaimedDetailList={
							marketingBonusAmountClaimedDetailList
						}
						onTableChange={handleTableChange}
					/>
				</MarketingTableLayout.Detail>
			</MarketingTableLayout>
		</LayoutContent.Main>
	)
}

export default BonusAmountClaimed
