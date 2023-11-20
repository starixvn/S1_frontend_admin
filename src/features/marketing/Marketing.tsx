import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import download from 'downloadjs'
import moment from 'moment/moment'
import { Form, message, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useQueryParams, useAuth } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import {
	selectCurrencyIdsBySiteIds,
	selectAllSiteEnableCurrencyList,
	selectUserSiteList,
} from 'common/enum'
import MarketingFilter from 'features/marketing/MarketingFilter'
import MarketingStatistic from 'features/marketing/MarketingStatistic'
import {
	IFilterForm,
	IGetPerformanceHighlightDataForMultiSitesArgs,
} from 'features/marketing/type'
import {
	useExportPerformanceHighlightMutation,
	useLazyGetPerformanceHighlightDataForMultiSitesQuery,
} from 'features/marketing/api'

const Marketing = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm<IFilterForm>()
	const watchSiteIds = Form.useWatch('siteIds', filterForm)
	const userSiteList = useAppSelector(selectUserSiteList)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()

	const [isInOneDay, setIsInOneDay] = useState<boolean>(false)
	const [selectDate, setSelectDate] = useState(null)

	const [
		getPerformanceHighlightDataForMultiSites,
		{
			data: { data: performanceHighlightDataForMultiSites = [] } = {},
			isFetching: isPerformanceHighlightDataForMultiSitesFetching,
		},
	] = useLazyGetPerformanceHighlightDataForMultiSitesQuery()

	const [exportPerformanceHighlight] = useExportPerformanceHighlightMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		const {
			siteIds,
			currencyIds,
			baseCurrencyId,
			isCompared = false,
			dateRange,
			compareDateRange,
		} = filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		// 小於一天內不顯示 Statistic 的 CR RR
		setIsInOneDay(false)
		if (moment(endDate).diff(moment(startDate), 'days') === 0) {
			setIsInOneDay(true)
		}
		const [comparedStartDate, comparedEndDate] = dateRangeToUtcFormatter(
			compareDateRange,
			currentTimeZoneUtcOffset
		)

		const args: IGetPerformanceHighlightDataForMultiSitesArgs = {
			siteIds,
			currencyIds,
			startDate,
			endDate,
			isCompared,
			comparedStartDate,
			comparedEndDate,
			baseCurrencyId,
		}

		try {
			await getPerformanceHighlightDataForMultiSites(args).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}

		setQueryParams({
			...args,
			timeZone: currentTimeZoneUtcOffset,
		})
	}

	const handleExportPerformanceHighlight = async ({
		exportSiteId,
	}: {
		exportSiteId: number
	}) => {
		if (!exportSiteId) return
		const { currencyIds, startDate, endDate, baseCurrencyId } = queryParams

		try {
			const blob = await exportPerformanceHighlight({
				siteId: exportSiteId,
				currencyIds: currencyIds.map((value: string) => Number(value)),
				startDate,
				endDate,
				baseCurrencyId: Number(baseCurrencyId),
			}).unwrap()

			download(
				blob,
				`Business Performance Highlight_${moment().format(
					'YYYYMMDDHHmmss'
				)}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		// init
		const init = () => {
			const {
				siteIds = [],
				currencyIds = [],
				startDate,
				endDate,
				isCompared,
				periodTime = 0,
				comparedStartDate,
				comparedEndDate,
				baseCurrencyId,
				timeZone,
			} = queryParams

			onTimeZoneChange(Number(timeZone))

			filterForm.setFieldsValue({
				siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				dateRange: [moment(startDate), moment(endDate)],
				isCompared: Boolean(isCompared),
				periodTime: Number(periodTime),
				compareDateRange: [moment(comparedStartDate), moment(comparedEndDate)],
				baseCurrencyId: Number(baseCurrencyId),
			})

			handleSearch({
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}

		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<MarketingFilter
				loading={isPerformanceHighlightDataForMultiSitesFetching}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListByAllSite={currencyListByAllSite}
				selectDate={selectDate}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				setSelectDate={setSelectDate}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{!isEmpty(queryParams) && (
				<LayoutContent.Card>
					<Tabs defaultActiveKey='1' type='card'>
						{performanceHighlightDataForMultiSites.map(item => (
							<Tabs.TabPane tab={item.siteName} key={item.siteId}>
								<MarketingStatistic
									loading={isPerformanceHighlightDataForMultiSitesFetching}
									isInOneDay={isInOneDay}
									exportExcelPermission={exportExcelPermission}
									performanceHighlightData={item ?? {}}
									onExportClick={handleExportPerformanceHighlight}
								/>
							</Tabs.TabPane>
						))}
					</Tabs>
				</LayoutContent.Card>
			)}
		</LayoutContent.Main>
	)
}

export default Marketing
