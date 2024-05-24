import {
	Form,
	FormInstance,
	Space,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { EditableCellRows, Table } from 'components'
import React from 'react'
import { PaginationInterface } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { IGetReasonListData } from 'features/reasonManagement/type'
import { PermissionInterface } from 'type'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'

interface IReasonManagementTableProps {
	loading: boolean
	form: FormInstance
	pagination: PaginationInterface
	reasonList: IGetReasonListData[]
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
	editingKey: number | undefined
	onSaved: () => void
	editPermission?: PermissionInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
}
const ReasonManagementTable = ({
	loading,
	form,
	pagination,
	reasonList,
	editingKey,
	setEditingKey,
	onSaved,
	editPermission,
	onTableChange,
	timeZoneUtcOffset,
}: IReasonManagementTableProps) => {
	const { t } = useTranslation()
	const isEditing = (record: IGetReasonListData) => record.id === editingKey
	const onEdit = (record: IGetReasonListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.id)
	}
	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: '10%',
			align: 'center' as 'center',
			render: (record: IGetReasonListData) => {
				const editable = isEditing(record)

				return editable ? (
					<Space>
						<Typography.Link
							onClick={() => onSaved()}
							style={{ marginRight: 8 }}
						>
							{t('Label_Save')}
						</Typography.Link>
						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_FuncKey'),
			key: 'funcKey',
			dataIndex: 'funcKey',
			width: '25%',
			align: 'center' as 'center',
			render: (funcKey: string) => funcKey ?? '',
		},
		{
			title: t('Label_ReasonId'),
			key: 'reasonId',
			dataIndex: 'reasonId',
			width: '5%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Description'),
			key: 'description',
			dataIndex: 'description',
			width: '20%',
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: '20%',
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime
					? dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Update'),
			key: 'updator',
			dataIndex: 'updator',
			width: '10%',
			align: 'center' as 'center',
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetReasonListData) => ({
				record,
				inputType: 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})
	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					dataSource={reasonList ?? []}
					pagination={pagination as TablePaginationConfig}
					columns={mergeColumns}
					onChange={onTableChange}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { ReasonManagementTable }
