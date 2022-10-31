import { useTranslation } from 'react-i18next'
import {
	Form,
	FormInstance,
	Popconfirm,
	Space,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { PaginationInterface } from 'common/hooks'
import { IGetCustNotesData } from 'features/memberProfile/type'
import { Dispatch, SetStateAction } from 'react'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'
import { EditableCellRows } from 'components'
import { PermissionInterface } from 'type'

interface ICustomerNotesTableProps {
	notePermissions: {
		noteDeletePermission: PermissionInterface | undefined
		noteEditPermission: PermissionInterface | undefined
	}
	loading: boolean
	form: FormInstance
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	custNotes: IGetCustNotesData[]
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onDeleteNote: (record: IGetCustNotesData) => void
	onSetNote: (record: IGetCustNotesData) => void
	timeZoneUtcOffset: number
}

const CustomerNotesTable = ({
	loading,
	form,
	pagination,
	onTableChange,
	custNotes,
	editingKey,
	setEditingKey,
	onDeleteNote,
	onSetNote,
	timeZoneUtcOffset,
	notePermissions: { noteDeletePermission, noteEditPermission },
}: ICustomerNotesTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetCustNotesData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.id)
	}

	const isEditing = (record: IGetCustNotesData) => record.id === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetCustNotesData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={() => onSetNote(record)}>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Space size='middle'>
						<Typography.Link
							disabled={!noteEditPermission?.canUse}
							onClick={() => onEdit(record)}
						>
							{t('Label_Edit')}
						</Typography.Link>
						<Popconfirm
							disabled={!noteDeletePermission?.canUse}
							title={t('Label_SureToDelete')}
							onConfirm={() => onDeleteNote(record)}
						>
							<Typography.Link disabled={!noteDeletePermission?.canUse}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Note'),
			key: 'note',
			dataIndex: 'note',
			width: 150,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_Creator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
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
			onCell: (record: IGetCustNotesData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'text',
			}),
		}
	})

	return (
		<Form form={form} component={false}>
			<Table
				loading={loading}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				components={{
					body: {
						cell: EditableCellRows,
					},
				}}
				style={{ marginTop: '10px', marginBottom: '10px' }}
				dataSource={custNotes ?? []}
				columns={mergeColumns}
				bordered
			/>
		</Form>
	)
}

export { CustomerNotesTable }
