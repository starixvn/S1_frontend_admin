import { IGameExclusionData } from 'features/gameExclusion/type'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import {
	Popconfirm,
	Space,
	Switch,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'
import { useNavigate } from 'react-router-dom'

interface IGameExclusionTableProps {
	loading: boolean
	gameExclusionList: IGameExclusionData[]
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	editPermission?: PermissionInterface
	setActivePermission?: PermissionInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onDelete: (record: IGameExclusionData) => void
	onUpdateStatus: (record: IGameExclusionData) => void
}

const GameExclusionTable = ({
	loading,
	gameExclusionList,
	timeZoneUtcOffset,
	pagination,
	editPermission,
	setActivePermission,
	onTableChange,
	onDelete,
	onUpdateStatus,
}: IGameExclusionTableProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 160,
			align: 'center' as 'center',
			render: (record: IGameExclusionData) => (
				<Space style={{ padding: '5px' }}>
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() => navigate(String(record.custId))}
					>
						{t('Label_Edit')}
					</Typography.Link>
					<Popconfirm
						disabled={!editPermission?.canUse}
						title={t('Label_SureToDelete')}
						onConfirm={() => onDelete(record)}
					>
						<Typography.Link disabled={!editPermission?.canUse}>
							{t('Label_Delete')}
						</Typography.Link>
					</Popconfirm>
				</Space>
			),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGameExclusionData) => {
				const { status } = record
				return (
					<Popconfirm
						disabled={!setActivePermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => onUpdateStatus(record)}
					>
						<Switch
							checked={Boolean(status)}
							disabled={!setActivePermission?.canUse}
						/>
					</Popconfirm>
				)
			},
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGameExclusionData) => {
				const { custId, userName } = record
				return (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Creator'),
			key: 'creator',
			dataIndex: 'creator',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (createTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{createTime
						? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'updateOperator',
			dataIndex: 'updateOperator',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{updateTime
						? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={gameExclusionList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { GameExclusionTable }
