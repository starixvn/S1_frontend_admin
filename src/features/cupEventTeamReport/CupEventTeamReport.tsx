import { FC } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import download from 'downloadjs'
import { useAuth } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import moment from 'moment'
import { message } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { getTimezoneInfo } from 'common/utils'
import { useTranslation } from 'react-i18next'
import { CupEventTeamReportTable } from 'features/cupEventTeamReport/CupEventTeamReportTable'
import {
	useExportCupEventTeamReportMutation,
	useGetCupEventTeamReportQuery,
	useSetPayoutMutation,
} from './api'
import { IGetCupEventReportResponse } from './type'

const CupEventTeamReport: FC<{ pageTitle?: string }> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission, editPermission } = {} } =
		useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset } = useTimeZone()

	const {
		data: { data: cupEventTeamReportData } = {} as IGetCupEventReportResponse,
		isFetching: isGetCupEventTeamReportDataLoading,
	} = useGetCupEventTeamReportQuery({
		siteId,
	})

	const [
		exportCupEventTeamReport,
		{ isLoading: isExportCupEventTeamReportLoading },
	] = useExportCupEventTeamReportMutation()

	const [setPayout, { isLoading: isSetPayoutLoading }] = useSetPayoutMutation()

	const handleExport = async (teamId: number) => {
		try {
			const { utcOffsetStr } = getTimezoneInfo(timeZoneUtcOffset)

			const blob = await exportCupEventTeamReport({
				siteId,
				teamId,
				timezone: utcOffsetStr,
			}).unwrap()
			download(
				blob,
				`ExportCupEventTeamReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetPayout = async (teamId: number) => {
		try {
			await setPayout({
				siteId,
				teamId,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isGetCupEventTeamReportDataLoading ||
		isExportCupEventTeamReportLoading ||
		isSetPayoutLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<CupEventTeamReportTable
				loading={loading}
				cupEventTeamReportData={cupEventTeamReportData}
				timeZoneUtcOffset={timeZoneUtcOffset}
				exportExcelPermission={exportExcelPermission}
				editPermission={editPermission}
				onExport={handleExport}
				onSetPayout={handleSetPayout}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default CupEventTeamReport
