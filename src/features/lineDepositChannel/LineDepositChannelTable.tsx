import { Dispatch, FC, SetStateAction } from 'react'
import {
	Form,
	FormInstance,
	Popconfirm,
	Space,
	Switch,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { IGetLineChannelListData } from 'features/lineDepositChannel/type'
import { PermissionInterface } from 'type'
import { EditableCellRows, Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { PaginationInterface } from 'common/hooks'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'

interface ILineDepositChannelTableProps {
	form: FormInstance
	lineChannelList: IGetLineChannelListData[]
	editPermission?: PermissionInterface
	deletePermission?: PermissionInterface
	loading: boolean
	timeZoneUtcOffset: number
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onRowSaved: (record: IGetLineChannelListData) => void
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onDeleteChannel: (record: IGetLineChannelListData) => void
}

const LineDepositChannelTable: FC<ILineDepositChannelTableProps> = ({
	form,
	lineChannelList,
	editPermission,
	loading,
	timeZoneUtcOffset,
	editingKey,
	setEditingKey,
	onRowSaved,
	pagination,
	onTableChange,
	onDeleteChannel,
	deletePermission,
}) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetLineChannelListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.id)
	}

	const isEditing = (record: IGetLineChannelListData) =>
		record.id === editingKey
	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetLineChannelListData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={() => onRowSaved(record)}>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Space size='middle'>
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() => onEdit(record)}
						>
							{t('Label_Edit')}
						</Typography.Link>
						<Popconfirm
							disabled={!deletePermission?.canUse}
							title={t('Label_SureToDelete')}
							onConfirm={() => onDeleteChannel(record)}
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
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 80,
			align: 'center' as 'center',
			render: (isoCode: string) => isoCode ?? 'N/A',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetLineChannelListData) => {
				const editable = isEditing(record)
				const { status } = record
				return (
					<Space align='center'>
						{editable ? (
							<Form.Item
								name='status'
								style={{ margin: 0 }}
								valuePropName='checked'
							>
								<Switch disabled={!editable} />
							</Form.Item>
						) : (
							<Switch checked={Boolean(status)} disabled />
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_Link'),
			key: 'link',
			dataIndex: 'link',
			width: 300,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastOperator',
			dataIndex: 'lastOperator',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IGetLineChannelListData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'text',
			}),
		}
	})

	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					columns={mergeColumns}
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					rowKey='id'
					dataSource={lineChannelList ?? []}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { LineDepositChannelTable }
