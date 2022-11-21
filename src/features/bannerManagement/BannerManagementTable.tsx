import { LayoutContent } from 'app/pages/layout'
import {
	Popconfirm,
	Space,
	Switch,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import moment from 'moment'
import { PermissionInterface } from 'type'
import { IGetBannerListData } from 'features/bannerManagement/type'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'
import { EditableCellRows } from 'components'
import { useTranslation } from 'react-i18next'

interface IBannerManagementTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	editPermission?: PermissionInterface
	bannerTypeList: IEnumTypeData[]
	bannerActionModeList: IEnumTypeData[]
	showStatusList: IEnumTypeData[]
	bannerList: IGetBannerListData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	onEditing: (record: IGetBannerListData) => void
	onDelete: (record: IGetBannerListData) => void
	onStatusChange: (record: IGetBannerListData) => void
}

const BannerManagementTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	editPermission,
	bannerTypeList,
	bannerActionModeList,
	showStatusList,
	bannerList,
	onTableChange,
	onEditing,
	onDelete,
	onStatusChange,
}: IBannerManagementTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 160,
			align: 'center' as 'center',
			render: (record: IGetBannerListData) => (
				<Space style={{ padding: '5px' }}>
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() => onEditing(record)}
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
			render: (record: IGetBannerListData) => (
				<Space>
					<Popconfirm
						disabled={!editPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => onStatusChange(record)}
					>
						<Switch
							checked={Boolean(record.status)}
							disabled={!editPermission?.canUse}
						/>
					</Popconfirm>
				</Space>
			),
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 80,
			align: 'center' as 'center',
			render: (currency: string) => currency ?? '-',
		},
		{
			title: t('Label_Type'),
			key: 'bannerType',
			dataIndex: 'bannerType',
			width: 100,
			align: 'center' as 'center',
			render: (bannerType: number) =>
				bannerTypeList.map(({ value, name }) => value === bannerType && name),
		},
		{
			title: t('Label_Name'),
			key: 'bannerName',
			dataIndex: 'bannerName',
			width: 100,
			align: 'center' as 'center',
			render: (bannerName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{bannerName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_ActionMode'),
			key: 'actionMode',
			dataIndex: 'actionMode',
			width: 100,
			align: 'center' as 'center',
			render: (actionMode: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{bannerActionModeList.map(
						({ value, name }) => value === actionMode && name
					)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_ShowStatus'),
			key: 'showStatus',
			dataIndex: 'showStatus',
			width: 80,
			align: 'center' as 'center',
			render: (showStatus: number) =>
				showStatusList.map(({ value, name }) => value === showStatus && name),
		},
		{
			title: t('Label_StartTime'),
			key: 'startTime',
			dataIndex: 'startTime',
			width: 120,
			align: 'center' as 'center',
			render: (startTime: string) =>
				startTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(startTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_EndTime'),
			key: 'endTime',
			dataIndex: 'endTime',
			width: 120,
			align: 'center' as 'center',
			render: (endTime: string) =>
				endTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(endTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Sort'),
			key: 'sort',
			dataIndex: 'sort',
			width: 50,
			align: 'center' as 'center',
			render: (sort: number) => sort ?? '-',
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 80,
			align: 'center' as 'center',
			render: (lastUpdateUser: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{lastUpdateUser ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{lastUpdateTime
						? moment(lastUpdateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				components={{
					body: {
						cell: EditableCellRows,
					},
				}}
				loading={loading}
				dataSource={bannerList}
				pagination={pagination as TablePaginationConfig}
				columns={columns}
				onChange={onTableChange}
				size='small'
			/>
		</LayoutContent.Card>
	)
}

export default BannerManagementTable
