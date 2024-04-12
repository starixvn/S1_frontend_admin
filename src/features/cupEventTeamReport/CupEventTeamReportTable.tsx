import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { Popconfirm, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment'
import { PermissionInterface } from 'type'
import { IGetCupEventReportData } from './type'

interface ICupEventTeamReportProps {
	loading: boolean
	cupEventTeamReportData: IGetCupEventReportData[]
	timeZoneUtcOffset: number
	exportExcelPermission?: PermissionInterface
	editPermission?: PermissionInterface
	onExport: (teamId: number) => void
	onSetPayout: (teamId: number) => void
}

const CupEventTeamReportTable: FC<ICupEventTeamReportProps> = ({
	loading,
	timeZoneUtcOffset,
	cupEventTeamReportData,
	exportExcelPermission,
	editPermission,
	onExport,
	onSetPayout,
}) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Teams'),
			key: 'teamName',
			dataIndex: 'teamName',
			width: 80,
			align: 'center' as 'center',
			render: (teamName: string) => (
				<Typography.Text strong>{teamName}</Typography.Text>
			),
		},
		{
			title: t('Label_PredictUsers'),
			key: 'predictUserCount',
			dataIndex: 'predictUserCount',
			width: 60,
			align: 'center' as 'center',
			render: (predictUserCount: number) =>
				numberFormatter.format(predictUserCount),
		},
		{
			title: t('Label_Export'),
			key: 'export',
			dataIndex: 'teamId',
			width: 80,
			align: 'center' as 'center',
			render: (teamId: number) => {
				return (
					<Typography.Link
						disabled={!exportExcelPermission?.canUse}
						onClick={() => onExport(teamId)}
					>
						{t('Label_Export')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Winners'),
			key: 'isPayoutDone',
			width: 80,
			align: 'center' as 'center',
			render: (values: IGetCupEventReportData) => {
				const { isPayoutDone, teamId } = values
				return isPayoutDone ? (
					<Typography.Text type='secondary'>
						{t('Label_Process')}
					</Typography.Text>
				) : (
					<Popconfirm
						title={t('Label_AreYouSure')}
						disabled={!editPermission?.canUse}
						onConfirm={() => onSetPayout(teamId)}
					>
						<Typography.Link disabled={!editPermission?.canUse}>
							N/A
						</Typography.Link>
					</Popconfirm>
				)
			},
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 100,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime
					? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},

		{
			title: t('Label_Updater'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
			render: (operator: string | null) => operator || '',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={cupEventTeamReportData ?? []}
				pagination={false}
			/>
		</LayoutContent.Card>
	)
}
export { CupEventTeamReportTable }
