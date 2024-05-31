import React from 'react'
import {
	Form,
	Popconfirm,
	Space,
	Switch,
	Typography,
	FormInstance,
	TablePaginationConfig,
} from 'antd'
import dayjs from 'dayjs'
import { PaginationInterface } from 'common/hooks'
import { PermissionInterface } from 'type'
import { IEditForm, IGetListData } from 'features/bettingMonitorSetting/type'
import { timeFormat } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { EditableCellRows, Table } from 'components'
import { LayoutContent } from 'app/pages/layout'

export interface IBettingMonitorTableProps {
	form: FormInstance<IEditForm>
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	editingKey: IGetListData | undefined
	editPermission?: PermissionInterface
	bettingMonitorList: IGetListData[]
	setEditingKey: React.Dispatch<React.SetStateAction<IGetListData | undefined>>
	onTableChange: (newPagination: TablePaginationConfig) => void
	onDelete: (record: IGetListData) => void
	onSaved: (record: IGetListData) => void
	onStatusChange: (record: IGetListData, status: boolean) => void
}

const BettingMonitorTable = ({
	form,
	loading,
	pagination,
	timeZoneUtcOffset,
	editingKey,
	editPermission,
	bettingMonitorList,
	setEditingKey,
	onTableChange,
	onDelete,
	onSaved,
	onStatusChange,
}: IBettingMonitorTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record)
	}
	const isEditing = (record: IGetListData) =>
		record.currencyId === editingKey?.currencyId &&
		record.categoryId === editingKey?.categoryId &&
		record.gameType === editingKey?.gameType

	const columns = [
		{
			title: t('Label_Action'),
			width: 160,
			align: 'center' as 'center',
			render: (record: IGetListData) => {
				const editable = isEditing(record)

				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={() => onSaved(record)}>
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
							disabled={!editPermission?.canUse}
							title={t('Label_SureToDelete')}
							onConfirm={() => onDelete(record)}
						>
							<Typography.Link disabled={!editPermission?.canUse}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 100,
			align: 'center' as 'center',
			render: (currency: string) => currency ?? '-',
		},
		{
			title: t('Label_Category'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			width: 100,
			align: 'center' as 'center',
			render: (categoryName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{categoryName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Product'),
			key: 'gameTypeName',
			dataIndex: 'gameTypeName',
			width: 100,
			align: 'center' as 'center',
			render: (gameTypeName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{gameTypeName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Frequency'),
			key: 'frequency',
			dataIndex: 'frequency',
			width: 80,
			align: 'center' as 'center',
			editable: true,
			render: (frequency: number) => {
				if (frequency === 0) {
					return '-'
				}
				const days =
					Math.floor(frequency / 1440) > 0
						? `${Math.floor(frequency / 1440)}${
								Math.floor(frequency / 1440) > 1
									? t('Label_Days')
									: t('Label_Day')
						  }`
						: ''
				const hours =
					Math.floor((frequency % 1440) / 60) > 0
						? `${Math.floor((frequency % 1440) / 60)}${
								Math.floor((frequency % 1440) / 60) > 1
									? t('Label_Hours')
									: t('Label_Hour')
						  }`
						: ''
				const mins =
					(frequency % 1440) % 60 > 0
						? `${(frequency % 1440) % 60}${
								(frequency % 1440) % 60 > 1 ? t('label_Mins') : t('label_Min')
						  }`
						: ''
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{days} {hours} {mins}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetListData) => (
				<Space>
					<Popconfirm
						disabled={!editPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => {
							onStatusChange(record, !record.status)
						}}
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
						? dayjs(lastUpdateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetListData) => ({
				record,
				inputType: 'number',
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
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					loading={loading}
					dataSource={bettingMonitorList ?? []}
					columns={mergeColumns}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default BettingMonitorTable
