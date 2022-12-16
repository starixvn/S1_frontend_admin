import {
	Form,
	FormInstance,
	Space,
	Switch,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { PermissionInterface } from 'type'
import { IDomainForm, IGetDomainListData } from 'features/externalDomain/type'
import { EditableTableCell } from 'features/vipRebateManagement/vipRebateManagementTable/EditableTableCell'

interface IExternalDomainTableProps {
	form: FormInstance<IDomainForm>
	loading: boolean
	domainList: IGetDomainListData[]
	pagination: PaginationInterface
	editPermission?: PermissionInterface
	timeZoneUtcOffset: number
	editingKey: number | undefined
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
	onTableChange: (newPagination: TablePaginationConfig) => void
	onSaved: (record: IGetDomainListData) => void
	onDelete: (record: IGetDomainListData) => void
}

const ExternalDomainTable = ({
	form,
	loading,
	domainList,
	pagination,
	editPermission,
	timeZoneUtcOffset,
	editingKey,
	setEditingKey,
	onTableChange,
	onSaved,
	onDelete,
}: IExternalDomainTableProps) => {
	const { t } = useTranslation()

	const isEditing = ({ dId: id }: IGetDomainListData) => id === editingKey

	const onEdit = (record: IGetDomainListData) => {
		const { dId: id, status } = record
		setEditingKey(id)
		form.setFieldsValue({
			sort: record.sort,
			domain: record.domain,
			status: Number(status),
		})
	}

	const columns = () => {
		return [
			{
				title: t('Label_Action'),
				key: 'operation',
				width: 160,
				align: 'center' as 'center',
				render: (record: IGetDomainListData) => {
					const editable = isEditing(record)
					return editable ? (
						<Space size='middle'>
							<Typography.Link
								onClick={() => {
									onSaved(record)
								}}
							>
								{t('Label_Save')}
							</Typography.Link>
							<Typography.Link onClick={() => setEditingKey(undefined)}>
								{t('Label_Cancel')}
							</Typography.Link>
						</Space>
					) : (
						<Space size='middle'>
							<Typography.Link
								onClick={() => {
									onEdit(record)
								}}
							>
								{t('Label_Edit')}
							</Typography.Link>

							<Typography.Link onClick={() => onDelete(record)}>
								{t('Label_Delete')}
							</Typography.Link>
						</Space>
					)
				},
			},
			{
				title: t('Label_Currency'),
				key: 'currency',
				width: 100,
				dataIndex: 'currency',
				align: 'center' as 'center',
			},
			{
				title: t('Label_Status'),
				key: 'status',
				width: 80,
				align: 'center' as 'center',
				render: (record: IGetDomainListData) => {
					const { status } = record
					const editable = isEditing(record)
					return editable ? (
						<Form.Item
							name='status'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch disabled={!editPermission?.canUse} />
						</Form.Item>
					) : (
						<Switch checked={Boolean(status)} disabled />
					)
				},
			},
			{
				title: t('Label_Sort'),
				key: 'sort',
				dataIndex: 'sort',
				width: 80,
				align: 'center' as 'center',
				editable: true,
			},
			{
				title: t('Label_Domain'),
				key: 'domain',
				dataIndex: 'domain',
				width: 120,
				align: 'center' as 'center',
				editable: true,
				render: (domain: string) => (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{domain ?? '-'}
					</Typography.Text>
				),
			},
			{
				title: t('Label_LastUpdateUser'),
				key: 'lastUpdateUser',
				dataIndex: `lastUpdateUser`,
				width: 100,
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
				width: 100,
				align: 'center' as 'center',
				render: (lastUpdateTime: string) => (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5x' }}>
						{lastUpdateTime
							? moment(lastUpdateTime)
									.utcOffset(timeZoneUtcOffset)
									.format(timeFormat)
							: '-'}
					</Typography.Text>
				),
			},
		]
	}

	const mergedColumns = columns().map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetDomainListData) => ({
				record,
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
							cell: EditableTableCell,
						},
					}}
					loading={loading}
					columns={mergedColumns}
					dataSource={domainList}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default ExternalDomainTable
