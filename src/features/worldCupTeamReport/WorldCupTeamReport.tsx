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
import { useTranslation } from 'react-i18next'
import { WorldCupTeamReportTable } from './WorldCupTeamReportTable'
import {
	useExportWorldCupTeamReportMutation,
	useGetWorldCupTeamReportQuery,
	useSetPayoutMutation,
} from './api'
import { IGetWorldCupReportResponse } from './type'

const WorldCupTeamReport: FC<{ pageTitle?: string }> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission, editPermission } = {} } =
		useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset } = useTimeZone()

	const {
		data: { data: worldCupTeamReportData } = {} as IGetWorldCupReportResponse,
		isFetching: isGetWorldCupTeamReportDataLoading,
	} = useGetWorldCupTeamReportQuery({
		siteId,
	})

	const [
		exportWorldCupTeamReport,
		{ isLoading: isExportWorldCupTeamReportLoading },
	] = useExportWorldCupTeamReportMutation()

	const [setPayout, { isLoading: isSetPayoutLoading }] = useSetPayoutMutation()

	const handleExport = async (teamId: number) => {
		try {
			const blob = await exportWorldCupTeamReport({ siteId, teamId }).unwrap()
			download(
				blob,
				`ExportWorldCupTeamReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
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
		isGetWorldCupTeamReportDataLoading ||
		isExportWorldCupTeamReportLoading ||
		isSetPayoutLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WorldCupTeamReportTable
				loading={loading}
				worldCupTeamReportData={worldCupTeamReportData}
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

export default WorldCupTeamReport
