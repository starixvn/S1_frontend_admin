import {
	IGetDeepLinkData,
	IGetDeepLinkListData,
} from 'features/providerAppDownload/type'
import { PaginationInterface } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	Form,
	FormInstance,
	Select,
	Space,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { EditableCellRows, Table } from 'components'
import { PermissionInterface } from 'type'
import { Dispatch, SetStateAction } from 'react'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'

interface IProviderAppDownloadTableProps {
	loading: boolean
	form: FormInstance
	deepLinkData: IGetDeepLinkData[]
	deepLinkList: IGetDeepLinkListData[]
	editPermission?: PermissionInterface
	typeList: IEnumTypeData[]
	protocolList: IEnumTypeData[]
	editingKey: string | undefined
	timeZoneUtcOffset: number
	setEditingKey: Dispatch<SetStateAction<string | undefined>>
	pagination: PaginationInterface
	onRowSaved: () => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const { Option } = Select

const ProviderAppDownloadTable = ({
	loading,
	form,
	deepLinkData,
	editPermission,
	editingKey,
	typeList,
	protocolList,
	deepLinkList,
	timeZoneUtcOffset,
	setEditingKey,
	pagination,
	onRowSaved,
	onTableChange,
}: IProviderAppDownloadTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetDeepLinkData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.key)
	}

	const isEditing = (record: IGetDeepLinkData) => record.key === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetDeepLinkData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={() => onRowSaved()}>
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
			title: t('Label_DeepLinkType'),
			key: 'deepLinkName',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetDeepLinkData) => {
				const editable = isEditing(record)
				const { deepLinkName } = record
				return editable ? (
					<Form.Item name='deepLinkId' style={{ margin: 0 }}>
						<Select>
							{deepLinkList.map(({ id, name }) => (
								<Option key={id} value={id}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					deepLinkName
				)
			},
		},
		{
			title: t('Label_Type'),
			key: 'type',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetDeepLinkData) => {
				const editable = isEditing(record)
				const { typeName } = record
				return editable ? (
					<Form.Item name='type' style={{ margin: 0 }}>
						<Select disabled>
							{typeList.map(({ value, name }) => (
								<Option key={value} value={value}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					typeName
				)
			},
		},
		{
			title: t('Label_ProtocolType'),
			key: 'protocolType',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetDeepLinkData) => {
				const editable = isEditing(record)
				const { protocolTypeName } = record
				return editable ? (
					<Form.Item name='protocolType' style={{ margin: 0 }}>
						<Select>
							{protocolList.map(({ value, name }) => (
								<Option key={value} value={value}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					protocolTypeName
				)
			},
		},
		{
			title: t('Label_Domain'),
			key: 'domain',
			dataIndex: 'domain',
			width: 150,
			align: 'center' as 'center',
			editable: true,
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

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IGetDeepLinkData) => ({
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
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
					dataSource={deepLinkData}
					columns={mergeColumns}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { ProviderAppDownloadTable }
