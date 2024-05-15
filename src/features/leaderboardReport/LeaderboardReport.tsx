import { isEmpty } from 'lodash'
import download from 'downloadjs'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useAuth, useQueryParams } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import {
	selectCurrencyIdsBySiteIds,
	selectCurrencyListBySite,
	selectUserSiteList,
} from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import {
	useLazyGetLeaderboardBySiteIdsQuery,
	useExportLeaderboardReportMutation,
} from 'features/leaderboardReport/api'
import { IFilterForm } from 'features/leaderboardReport/type'
import LeaderboardReportTable from 'features/leaderboardReport/LeaderboardReportTable'
import LeaderboardReportFilter from 'features/leaderboardReport/LeaderboardReportFilter'

const LeaderboardReport = ({ pageTitle }: { pageTitle?: string }) => {
	const [form] = Form.useForm<IFilterForm>()
	const { t } = useTranslation()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const userSiteList = useAppSelector(selectUserSiteList)

	const watchSiteIds = Form.useWatch('siteId', form)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds ? [watchSiteIds] : [])
	)

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const [
		getLeaderboardReport,
		{
			data: { data: leaderboardReportList = [] } = {},
			isFetching: isGetLeaderboardFetching,
		},
	] = useLazyGetLeaderboardBySiteIdsQuery()

	const {
		data: { data: LeaderBoardCategoryList = [] } = {},
		isLoading: isGetLeaderBoardCategoryLoading,
	} = useGetEnumTypeQuery({
		enumName: 'LeaderBoardCategoryEnum',
	})

	const [
		exportLeaderboardReport,
		{ isLoading: isExportLeaderboardReportLoading },
	] = useExportLeaderboardReportMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		const {
			siteId,
			monthRange,
			categoryId,
			currencyId = 0,
		} = form.getFieldsValue()
		// 如果是選到當月 則 startDate 是這月ㄧ號0時0分0秒 到 現在確切時間的 endDate
		// 如果不是則 startDate 是這月ㄧ號0時0分0秒 到 這月底23:23:59的 endDate
		const [startDate, endDate] = dayjs(monthRange).isSame(dayjs(), 'month')
			? dateRangeToUtcFormatter(
					[monthRange.startOf('month').toDate(), dayjs()],
					currentTimeZoneUtcOffset
			  )
			: dateRangeToUtcFormatter(
					[
						monthRange.startOf('month').toDate(),
						monthRange.endOf('month').toDate(),
					],
					currentTimeZoneUtcOffset
			  )

		const args = {
			startDate,
			endDate,
			currencyId,
			categoryId,
		}

		try {
			await getLeaderboardReport({
				siteIds: [siteId],
				...args,
			}).unwrap()
			setQueryParams({
				timeZone: currentTimeZoneUtcOffset,
				siteId,
				...args,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const { siteId, startDate, endDate, currencyId, categoryId } = queryParams

		try {
			const blob = await exportLeaderboardReport({
				siteIds: [siteId],
				startDate,
				endDate,
				currencyId: Number(currencyId),
				categoryId: categoryId ? Number(categoryId) : 0,
			}).unwrap()

			download(
				blob,
				`LeaderboardReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = isGetLeaderboardFetching || isGetLeaderBoardCategoryLoading

	useEffect(() => {
		// init
		const init = () => {
			// 因為只顯示同個月份 所以取 startDate endDate 相同
			const {
				siteId,
				startDate,
				currencyId,
				categoryId = 0,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))

			form.setFieldsValue({
				siteId: Number(siteId),
				monthRange: dayjs(startDate).isSame(dayjs(), 'month')
					? dayjs()
					: dayjs(startDate),
				currencyId: Number(currencyId),
				categoryId: Number(categoryId),
			})

			handleSearch({})
		}

		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<LeaderboardReportFilter
				loading={loading}
				form={form}
				currencyListBySite={currencyListBySite}
				LeaderBoardCategoryList={LeaderBoardCategoryList}
				onSearch={handleSearch}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
			/>
			{!isEmpty(queryParams) && (
				<LeaderboardReportTable
					loading={loading}
					leaderboardReportList={leaderboardReportList}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportLeaderboardReportLoading}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default LeaderboardReport
