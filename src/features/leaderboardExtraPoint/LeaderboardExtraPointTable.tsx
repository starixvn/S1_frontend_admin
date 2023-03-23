import { Table } from 'components'
import moment from 'moment/moment'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { LayoutContent } from 'app/pages/layout'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import { ILeaderboardExtraPointData } from 'features/leaderboardExtraPoint/type'

interface ILeaderboardExtraPointTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	leaderboardExtraPointList: ILeaderboardExtraPointData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const LeaderboardExtraPointTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	leaderboardExtraPointList,
	onTableChange,
}: ILeaderboardExtraPointTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			align: 'center' as 'center',
			width: '10%',
			render: (currency: string) => currency || '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			align: 'center' as 'center',
			width: '15%',
			render: ({ custId, userName }: ILeaderboardExtraPointData) =>
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
			title: t('Label_ActiveDate'),
			key: 'activeDate',
			dataIndex: 'activeDate',
			align: 'center' as 'center',
			width: '15%',
			render: (activeDate: string) =>
				activeDate
					? moment(activeDate).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Category'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			align: 'center' as 'center',
			width: '10%',
			render: (categoryName: number) => categoryName || '-',
		},
		{
			title: t('Label_ExtraPoint'),
			key: 'extraPoint',
			dataIndex: 'extraPoint',
			align: 'center' as 'center',
			width: '10%',
			render: (extraPoint: string) => extraPoint ?? 'N/A',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			width: '15%',
			render: (createTime: string) =>
				createTime
					? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			align: 'center' as 'center',
			width: '15%',
			render: (updateTime: string) =>
				updateTime
					? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			align: 'center' as 'center',
			width: '10%',
			render: (lastUpdateUser: string) => lastUpdateUser || '-',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				onChange={onTableChange}
				dataSource={leaderboardExtraPointList}
				pagination={pagination as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export default LeaderboardExtraPointTable
