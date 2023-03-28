import { Table } from 'components'
import { Typography } from 'antd'
import paths from 'app/constants/paths'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { LayoutContent } from 'app/pages/layout'
import { ILeaderboardReportData } from 'features/leaderboardReport/type'

interface ILeaderboardReportTableProps {
	loading: boolean
	leaderboardReportList: ILeaderboardReportData[]
}

const LeaderboardReportTable = ({
	loading,
	leaderboardReportList,
}: ILeaderboardReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			align: 'center' as 'center',
			width: '20%',
			render: (isoCode: string) => isoCode || '-',
		},
		{
			title: t('Label_Ranking'),
			key: 'ranking',
			dataIndex: 'ranking',
			align: 'center' as 'center',
			width: '20%',
			render: (ranking: string) => ranking || '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			align: 'center' as 'center',
			width: '30%',
			render: ({ custId, userName }: ILeaderboardReportData) =>
				userName ? (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				) : (
					'-'
				),
		},
		{
			title: t('Label_Points'),
			key: 'points',
			dataIndex: 'points',
			align: 'center' as 'center',
			width: '30%',
			render: (points: number) => numberFormatter.format(points) ?? 'N/A',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={leaderboardReportList}
				pagination={false}
			/>
		</LayoutContent.Card>
	)
}

export default LeaderboardReportTable
