import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { PermissionInterface } from 'type'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { Table } from 'components'
import {
	Space,
	Typography,
	Popconfirm,
	TablePaginationConfig,
	Form,
	FormInstance,
	DatePicker,
} from 'antd'
import { ITpMaintenanceData, IEditForm } from 'features/productMaintenance/type'

interface IProductMaintenanceTableProps {
	loading: boolean
	form: FormInstance<IEditForm>
	pagination: PaginationInterface
	tpMaintenanceList: ITpMaintenanceData[]
	editPermission?: PermissionInterface
	deletePermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	timeZoneUtcOffset: number
	onDelete: (sn: number) => void
	onRowSaved: () => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const { RangePicker } = DatePicker

const ProductMaintenanceTable = ({
	loading,
	form,
	pagination,
	tpMaintenanceList,
	editPermission,
	editingKey,
	deletePermission,
	setEditingKey,
	timeZoneUtcOffset,
	onDelete,
	onRowSaved,
	onTableChange,
}: IProductMaintenanceTableProps) => {
	const { t } = useTranslation()

	const onEdit = ({ beginDate, endDate, sn }: ITpMaintenanceData) => {
		form.setFieldsValue({
			dateRange: [dayjs(beginDate), dayjs(endDate)],
		})
		setEditingKey(sn)
	}

	const isEditing = (record: ITpMaintenanceData) => record.sn === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			width: '10%',
			key: 'operation',
			align: 'center' as 'center',
			render: (record: ITpMaintenanceData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={onRowSaved}>
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
							title={t('Label_SureToDelete')}
							disabled={!deletePermission?.canUse}
							onConfirm={() => onDelete(record.sn)}
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
			title: t('Label_TpName'),
			key: 'tpName',
			dataIndex: 'tpName',
			align: 'center' as 'center',
			width: '10%',
			render: (tpName: string) => tpName || '-',
		},
		{
			title: t('Label_TpTypeName'),
			key: 'typeName',
			dataIndex: 'typeName',
			align: 'center' as 'center',
			width: '10%',
			render: (typeName: string) => typeName || '-',
		},
		{
			title: t('Label_CategoryName'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			align: 'center' as 'center',
			width: '10%',
			render: (categoryName: string) => categoryName || '-',
		},
		{
			title: t('Label_MaintenanceStart'),
			key: 'beginDate',
			align: 'center' as 'center',
			width: '15%',
			onCell: (record: ITpMaintenanceData) => {
				const editable = isEditing(record)
				return {
					colSpan: editable ? 2 : 1,
				}
			},
			render: (record: ITpMaintenanceData) => {
				const { beginDate = '' } = record
				const editable = isEditing(record)
				return editable ? (
					<Form.Item
						noStyle
						name='dateRange'
						initialValue={DATE_RANGES.Today}
						rules={[
							{
								required: true,
								message: t('Label_DateRangeRequire'),
							},
						]}
					>
						<RangePicker
							style={{ width: '100%' }}
							ranges={RANGE_PICKER_RANGES([
								'Today',
								'Yesterday',
								'Last Week',
								'This Month',
								'Last Month',
							])}
							showTime
						/>
					</Form.Item>
				) : (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(beginDate).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_MaintenanceEnd'),
			key: 'endDate',
			align: 'center' as 'center',
			width: '15%',
			onCell: (record: ITpMaintenanceData) => {
				const editable = isEditing(record)
				return {
					colSpan: editable ? 0 : 1,
				}
			},
			render: ({ endDate }: ITpMaintenanceData) =>
				endDate ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(endDate).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			align: 'center' as 'center',
			width: '15%',
			render: ({ updateTime }: ITpMaintenanceData) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Updater'),
			key: 'updateUser',
			dataIndex: 'updateUser',
			align: 'center' as 'center',
			width: '10%',
			render: (updateUser: string) => updateUser || '-',
		},
	]

	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					columns={columns}
					dataSource={tpMaintenanceList}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default ProductMaintenanceTable
