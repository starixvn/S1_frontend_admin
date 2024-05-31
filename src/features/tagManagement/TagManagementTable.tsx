import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import React, { Dispatch, SetStateAction } from 'react'
import { EditableCellRows, Table, ColorPicker } from 'components'

import {
	Form,
	FormInstance,
	Space,
	Typography,
	Switch,
	Tag,
	TablePaginationConfig,
	Popconfirm,
} from 'antd'
import { IEditForm, IGetTagListData } from 'features/tagManagement/type'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { ColorResult } from 'react-color'
import { PermissionInterface } from 'type'

interface TagManagementProps {
	form: FormInstance<IEditForm>
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	addEditPermission?: PermissionInterface
	color: string
	onChangeColor: (color: ColorResult) => void
	onChangeRawColor: (colorData: string) => void
	editingKey: number | undefined
	tagList: IGetTagListData[]
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onTableChange: (newPagination: TablePaginationConfig) => void
	onRowSaved: () => void
	onStatusChange: (record: IGetTagListData) => void
}

const TagManagementTable = ({
	form,
	loading,
	pagination,
	timeZoneUtcOffset,
	addEditPermission,
	color,
	onChangeColor,
	onChangeRawColor,
	editingKey,
	tagList,
	setEditingKey,
	onTableChange,
	onRowSaved,
	onStatusChange,
}: TagManagementProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetTagListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.id)
		onChangeRawColor(record.tagColour)
	}

	const isEditing = (record: IGetTagListData) => record.id === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 150,
			align: 'center' as 'center',
			render: (record: IGetTagListData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={onRowSaved}>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link
							onClick={() => {
								setEditingKey(undefined)
							}}
						>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={!addEditPermission?.canUse}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 150,
			align: 'center' as 'center',
			render: (record: IGetTagListData) => {
				const { status } = record
				const editable = isEditing(record)
				return editable ? (
					<Switch checked={Boolean(status)} disabled />
				) : (
					<Popconfirm
						title={t('Label_AreYouSure')}
						onConfirm={() => onStatusChange(record)}
					>
						<Switch checked={Boolean(record.status)} />
					</Popconfirm>
				)
			},
		},
		{
			title: t('Label_TagName'),
			key: 'tagName',
			dataIndex: 'tagName',
			align: 'center' as 'center',
			width: '15%',
			editable: true,
		},
		{
			title: t('Label_TagColor'),
			key: 'tagColour',
			align: 'center' as 'center',
			width: '15%',
			render: (record: IGetTagListData) => {
				const { tagColour } = record
				const editable = isEditing(record)
				return editable ? (
					<ColorPicker color={color} onChangeComplete={onChangeColor} />
				) : (
					tagColour && <Tag color={tagColour}>{tagColour}</Tag>
				)
			},
		},
		{
			title: t('Label_Description'),
			key: 'description',
			dataIndex: 'description',
			align: 'center' as 'center',
			width: '25%',
			editable: true,
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: '15%',
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{updateTime
						? dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Updator'),
			key: 'updator',
			dataIndex: 'updator',
			align: 'center' as 'center',
			width: '10%',
			render: (updator: number) => updator ?? 'N/A',
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IGetTagListData) => ({
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
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					rowKey='id'
					columns={mergeColumns}
					dataSource={tagList ?? []}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default TagManagementTable
