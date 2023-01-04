import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import { Table } from 'components'
import { IMessageData } from 'features/smsGenerator/type'
import { PaginationInterface } from 'common/hooks'
import { LayoutContent } from 'app/pages/layout'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { statusList } from 'features/smsGenerator/constants'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'
import React from 'react'

interface ISmsGeneratorTableProps {
	loading: boolean
	messageList: IMessageData[]
	pagination: PaginationInterface
	deletePermission?: PermissionInterface
	exportExcelPermission?: PermissionInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	onEdit: (batchId: number) => void
	onExport: (batchId: number) => void
	onDelete: (batchId: number) => void
}

const SmsGeneratorTable = ({
	loading,
	messageList,
	pagination,
	deletePermission,
	exportExcelPermission,
	timeZoneUtcOffset,
	onTableChange,
	onEdit,
	onExport,
	onDelete,
}: ISmsGeneratorTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			dataIndex: 'batchId',
			align: 'center' as 'center',
			render: (batchId: number) => {
				return (
					<Space size='middle'>
						<Typography.Link onClick={() => onEdit(batchId)}>
							{t('Label_Edit')}
						</Typography.Link>
						<Popconfirm
							title={t('Label_SureToDelete')}
							onConfirm={() => onDelete(batchId)}
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
			title: t('Label_Result'),
			key: 'result',
			width: 100,
			align: 'center' as 'center',
			dataIndex: 'batchId',
			render: (batchId: number) => (
				<Typography.Link
					style={{ whiteSpace: 'nowrap' }}
					disabled={!exportExcelPermission?.canUse}
					onClick={() => onExport(batchId)}
				>{`${t('Label_Export')} ${t('Label_Excel')}`}</Typography.Link>
			),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (status: number) =>
				statusList[status] ? t(statusList[status]) : '-',
		},
		{
			title: t('Label_Title'),
			key: 'title',
			dataIndex: 'title',
			width: 100,
			align: 'center' as 'center',
			render: (title: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{title || '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Content'),
			key: 'content',
			dataIndex: 'content',
			width: 120,
			align: 'center' as 'center',
			render: (content: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{content || '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Creator'),
			key: 'creator',
			dataIndex: 'author',
			width: 100,
			align: 'center' as 'center',
			render: (author: string) => author || '-',
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
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 100,
			align: 'center' as 'center',
			render: (lastUpdateUser: string) => lastUpdateUser || '-',
		},
		{
			title: t('Label_LastUpdateTime'),
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
				dataSource={messageList}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { SmsGeneratorTable }
