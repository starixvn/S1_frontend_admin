import { isEmpty } from 'lodash'
import download from 'downloadjs'
import moment from 'moment/moment'
import { useEffect } from 'react'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useAuth, useQueryParams } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import {
	useLazyGetLeaderboardQuery,
	useExportLeaderboardReportMutation,
} from 'features/leaderboardReport/api'
import { IFilterForm } from 'features/leaderboardReport/type'
import LeaderboardReportTable from 'features/leaderboardReport/LeaderboardReportTable'
import LeaderboardReportFilter from 'features/leaderboardReport/LeaderboardReportFilter'

const LeaderboardReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [form] = Form.useForm<IFilterForm>()

	const [
		getLeaderboardReport,
		{
			data: { data: leaderboardReportList = [] } = {},
			isFetching: isGetLeaderboardFetching,
		},
	] = useLazyGetLeaderboardQuery()

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
		if (!siteId) return

		const { monthRange, categoryId, currencyId = 0 } = form.getFieldsValue()
		// 如果是選到當月 則 startDate 是這月ㄧ號0時0分0秒 到 現在確切時間的 endDate
		// 如果不是則 startDate 是這月ㄧ號0時0分0秒 到 這月底23:23:59的 endDate
		const [startDate, endDate] = moment(monthRange).isSame(moment(), 'month')
			? dateRangeToUtcFormatter(
					[monthRange.startOf('month').toDate(), moment()],
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
			siteId,
			startDate,
			endDate,
			currencyId,
			categoryId,
		}

		try {
			await getLeaderboardReport(args).unwrap()
			setQueryParams({
				timeZone: currentTimeZoneUtcOffset,
				...args,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		if (!siteId) return
		const { startDate, endDate, currencyId, categoryId } = queryParams

		try {
			const blob = await exportLeaderboardReport({
				siteId,
				startDate,
				endDate,
				currencyId: Number(currencyId),
				categoryId: categoryId ? Number(categoryId) : 0,
			}).unwrap()

			download(
				blob,
				`LeaderboardReport${moment().format('YYYYMMDDHHmmss')}.xlsx`
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
			const { startDate, currencyId, categoryId = 0, timeZone } = queryParams
			onTimeZoneChange(Number(timeZone))

			form.setFieldsValue({
				monthRange: moment(startDate).isSame(moment(), 'month')
					? moment()
					: moment(startDate),
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
