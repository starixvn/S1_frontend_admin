import moment from 'moment/moment'
import { Table } from 'components'
import { isString } from 'lodash'
import { useTranslation } from 'react-i18next'
import { timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import {
	Space,
	Typography,
	Switch,
	TablePaginationConfig,
	Popconfirm,
	Modal,
} from 'antd'
import { PermissionInterface } from 'type'
import { IAnnouncementListData } from 'features/announcement/type'

interface AnnouncementTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	announcementList: IAnnouncementListData[]
	editPermission?: PermissionInterface
	deletePermission?: PermissionInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onEdit: (id: number) => void
	onDelete: (id: number) => void
}

const { Text } = Typography

const AnnouncementTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	announcementList,
	editPermission,
	deletePermission,
	onTableChange,
	onEdit,
	onDelete,
}: AnnouncementTableProps) => {
	const { t } = useTranslation()

	const handleContentModal = (content: string) => {
		Modal.info({
			title: t('Label_Content'),
			closable: true,
			content: <Text>{content || '-'}</Text>,
			width: '540px',
		})
	}

	const columns = [
		{
			title: t('Label_Id'),
			key: 'id',
			dataIndex: 'id',
			align: 'center' as 'center',
			width: 80,
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 150,
			dataIndex: 'id',
			align: 'center' as 'center',
			render: (id: number) => {
				return (
					<Space size='middle'>
						<Typography.Link onClick={() => onEdit(id)}>
							{editPermission?.canUse ? t('Label_Edit') : t('Label_Detail')}
						</Typography.Link>
						<Popconfirm
							title={t('Label_SureToDelete')}
							onConfirm={() => onDelete(id)}
						>
							<Typography.Link disabled={!deletePermission?.canUse}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Sort'),
			key: 'seq',
			dataIndex: 'seq',
			align: 'center' as 'center',
			width: 80,
			render: (seq: number) => seq ?? 'N/A',
		},
		{
			title: t('Label_Subject'),
			key: 'subject',
			dataIndex: 'subject',
			align: 'center' as 'center',
			width: 150,
			render: (subject: string) =>
				isString(subject) && subject.length > 25 ? (
					<Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{subject.substring(0, 25)}...
						<Typography.Link onClick={() => handleContentModal(subject)}>
							more
						</Typography.Link>
					</Text>
				) : (
					<Text>{subject || '-'}</Text>
				),
		},
		{
			title: t('Label_Content'),
			key: 'content',
			dataIndex: 'content',
			align: 'center' as 'center',
			width: 150,
			render: (content: string) =>
				isString(content) && content.length > 25 ? (
					<Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{content.substring(0, 25)}...
						<Typography.Link onClick={() => handleContentModal(content)}>
							more
						</Typography.Link>
					</Text>
				) : (
					<Text>{content || '-'}</Text>
				),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			align: 'center' as 'center',
			width: 100,
			render: ({ status }: IAnnouncementListData) => {
				return <Switch checked={Boolean(status)} disabled />
			},
		},
		{
			title: t('Label_StartTime'),
			key: 'startTime',
			dataIndex: 'startTime',
			align: 'center' as 'center',
			width: 180,
			render: (startTime: string) => (
				<Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{startTime
						? moment(startTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Text>
			),
		},
		{
			title: t('Label_EndTime'),
			key: 'endTime',
			dataIndex: 'endTime',
			align: 'center' as 'center',
			width: 180,
			render: (endTime: string) => (
				<Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{endTime
						? moment(endTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Text>
			),
		},
		{
			title: t('Label_Creator'),
			key: 'creator',
			dataIndex: 'creator',
			align: 'center' as 'center',
			width: 100,
			render: (creator: string) => creator || '-',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			width: 180,
			render: (createTime: string) => (
				<Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{createTime
						? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Text>
			),
		},
		{
			title: t('Label_LastUpdater'),
			key: 'lastUpdater',
			dataIndex: 'lastUpdater',
			align: 'center' as 'center',
			width: 100,
			render: (lastUpdater: string) => lastUpdater ?? 'N/A',
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			align: 'center' as 'center',
			width: 180,
			render: (lastUpdateTime: string) => (
				<Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{lastUpdateTime
						? moment(lastUpdateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)
						: ''}
				</Text>
			),
		},
		{
			title: t('Label_isTest'),
			key: 'isTest',
			align: 'center' as 'center',
			width: 100,
			render: ({ isTest }: IAnnouncementListData) => {
				return <Switch checked={Boolean(isTest)} disabled />
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={announcementList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default AnnouncementTable
