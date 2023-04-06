import { useEffect } from 'react'
import { isEmpty } from 'lodash'
import download from 'downloadjs'
import moment from 'moment/moment'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useQueryParams, useAuth } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import {
	selectCurrencyListBySite,
	selectAllSiteEnableCurrencyList,
	selectUserSite,
} from 'common/enum'
import MarketingFilter from 'features/marketing/MarketingFilter'
import MarketingStatistic from 'features/marketing/MarketingStatistic'
import {
	IFilterForm,
	IPerformanceHighlightResponse,
} from 'features/marketing/type'
import {
	useLazyGetPerformanceHighlightQuery,
	useExportPerformanceHighlightMutation,
} from 'features/marketing/api'

const Marketing = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [filterForm] = Form.useForm<IFilterForm>()

	const [
		getPerformanceHighlight,
		{
			data: {
				data: performanceHighlightData,
			} = {} as IPerformanceHighlightResponse,
			isFetching: isGetPerformanceHighlightFetching,
		},
	] = useLazyGetPerformanceHighlightQuery()

	const [exportPerformanceHighlight] = useExportPerformanceHighlightMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return

		const {
			currencyIds,
			baseCurrencyId,
			isCompared = false,
			periodTime,
			dateRange,
			compareDateRange,
		} = filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		const [comparedStartDate, comparedEndDate] = dateRangeToUtcFormatter(
			compareDateRange,
			currentTimeZoneUtcOffset
		)

		const args = {
			siteId,
			startDate,
			endDate,
			isCompared,
			periodTime,
			comparedStartDate,
			comparedEndDate,
			currencyIds,
			baseCurrencyId,
		}

		try {
			await getPerformanceHighlight(args).unwrap()
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

	const handleExportPerformanceHighlight = async () => {
		if (!siteId) return
		const { currencyIds, startDate, endDate, baseCurrencyId } = queryParams

		try {
			const blob = await exportPerformanceHighlight({
				siteId,
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
				startDate,
				endDate,
				isCompared,
				periodTime = 0,
				comparedStartDate,
				comparedEndDate,
				currencyIds = [],
				baseCurrencyId,
				timeZone,
			} = queryParams

			onTimeZoneChange(Number(timeZone))

			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				isCompared: Boolean(isCompared),
				periodTime: Number(periodTime),
				compareDateRange: [moment(comparedStartDate), moment(comparedEndDate)],
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
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
				loading={isGetPerformanceHighlightFetching}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				currencyListByAllSite={currencyListByAllSite}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<MarketingStatistic
					loading={isGetPerformanceHighlightFetching}
					exportExcelPermission={exportExcelPermission}
					performanceHighlightData={performanceHighlightData ?? {}}
					onExportClick={handleExportPerformanceHighlight}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default Marketing
