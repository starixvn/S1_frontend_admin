import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import moment from 'moment'
import download from 'downloadjs'
import { LayoutContent } from 'app/pages/layout'
import {
	useExportUserOnlineReportMutation,
	useLazyGetUserOnlineReportListQuery,
} from 'features/userOnlineReport/api'
import {
	IFilterForm,
	INewUserOnlineReportData,
	IUserOnlineReportListResponse,
} from 'features/userOnlineReport/type'
import { isEmpty } from 'lodash'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import { useAuth, useQueryParams } from 'common/hooks'
import UserOnlineReportFilter from 'features/userOnlineReport/UserOnlineReportFilter'
import UserOnlineReportTable from 'features/userOnlineReport/UserOnlineReportTable'
import { userOnlineReportListConverter } from 'features/userOnlineReport/utils'

const UserOnlineReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [newUserOnlineRepostList, setNewUserOnlineRepostList] = useState<
		INewUserOnlineReportData[]
	>([])
	const [filterForm] = Form.useForm<IFilterForm>()
	const [
		getUserOnlineReportList,
		{ isFetching: isGetUserOnlineReportListFetching },
	] = useLazyGetUserOnlineReportListQuery()

	const [exportUserOnlineReport, { isLoading: isExportUserOnlineReport }] =
		useExportUserOnlineReportMutation()

	const handleSearch = async ({
		currentTimeZone = timeZoneUtcOffset,
	}: {
		currentTimeZone?: number
	}) => {
		const { date } = filterForm.getFieldsValue()
		const formatDate = moment(date).format('YYYY-MM-DD')

		if (!siteId) return
		try {
			const args = {
				siteIds: [siteId],
				selectDate: formatDate,
				timeZone: currentTimeZone,
			}
			const {
				data: {
					data: userOnlineReport = [],
				} = {} as IUserOnlineReportListResponse,
			} = await getUserOnlineReportList(args)
			setNewUserOnlineRepostList(
				userOnlineReportListConverter(userOnlineReport)
			)
			setQueryParams(args)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	const handleExport = async () => {
		const { selectDate, timeZone } = queryParams
		if (!siteId) return
		try {
			const args = {
				siteIds: [siteId],
				selectDate,
				timeZone,
			}
			const blob = await exportUserOnlineReport(args).unwrap()
			download(blob, `UserOnlineReport_${moment().format('YYYYMMDD')}.xlsx`)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (!isEmpty(queryParams)) {
				const { selectDate, timeZone } = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					date: moment(selectDate),
				})
				handleSearch({ currentTimeZone: Number(timeZone) })
			}
		}
		init()
	}, [])

	const loading = isGetUserOnlineReportListFetching || isExportUserOnlineReport

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<UserOnlineReportFilter
				form={filterForm}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<UserOnlineReportTable
					userOnlineReportList={newUserOnlineRepostList}
					loading={loading}
				/>
			)}
			<AffixButtons>
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportUserOnlineReport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default UserOnlineReport
