import { Dispatch, SetStateAction } from 'react'
import { Table, EditableCellRows } from 'components'
import { useTranslation } from 'react-i18next'
import { IPointLevelData } from 'features/pointLevelManagement/type'
import { Form, Space, Typography, Popconfirm, FormInstance, Switch } from 'antd'
import { PermissionInterface } from 'type'
import { last } from 'lodash'

interface PointLevelTableProps {
	loading: boolean
	form: FormInstance
	pointLevelData: IPointLevelData[]
	editPermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onDeletePointLevel: (pointLevel: number) => void
	onRowSaved: () => void
}

const PointLevelManagementTable = ({
	loading,
	form,
	pointLevelData,
	editPermission,
	editingKey,
	setEditingKey,
	onDeletePointLevel,
	onRowSaved,
}: PointLevelTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IPointLevelData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.pointLevel)
	}

	const isEditing = (record: IPointLevelData) =>
		record.pointLevel === editingKey

	const isLast = (record: IPointLevelData) =>
		last(pointLevelData)?.pointLevel === record.pointLevel

	const columns = [
		{
			title: t('Label_Action'),
			width: '10%',
			key: 'operation',
			render: (record: IPointLevelData) => {
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
							disabled={!editPermission?.canUse}
							onConfirm={() => onDeletePointLevel(record.pointLevel)}
						>
							<Typography.Link
								disabled={!editPermission?.canUse || !isLast(record)}
								onClick={() => isLast(record)}
							>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
			align: 'center' as 'center',
		},

		{
			title: t('Label_PointLevel'),
			key: 'pointLevel',
			dataIndex: 'pointLevel',
			align: 'center' as 'center',
			width: '20%',
			render: (pointLevel: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{`${t('Label_PointLevel')}  ${pointLevel}`}
				</Typography.Text>
			),
		},
		{
			title: t('Label_DepositCount'),
			key: 'depositCnt',
			dataIndex: 'depositCnt',
			align: 'center' as 'center',
			editable: true,
			width: '30%',
			render: (depositCnt: number) => depositCnt ?? 'N/A',
		},
		{
			title: t('Label_WithdrawalCount'),
			key: 'withdrawalCnt',
			dataIndex: 'withdrawalCnt',
			align: 'center' as 'center',
			editable: true,
			width: '30%',
			render: (withdrawalCnt: number) => withdrawalCnt ?? 'N/A',
		},
		{
			title: t('Label_isKyc'),
			key: 'isKyc',
			align: 'center' as 'center',
			width: '10%',
			render: (record: IPointLevelData) => {
				const { isKyc } = record
				const editable = isEditing(record)
				return editable ? (
					<Form.Item name='isKyc' style={{ margin: 0 }} valuePropName='checked'>
						<Switch disabled={!editable} />
					</Form.Item>
				) : (
					<Switch checked={Boolean(isKyc)} disabled />
				)
			},
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IPointLevelData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'number',
			}),
		}
	})

	return (
		<Form form={form} component={false}>
			<Table
				loading={loading}
				components={{
					body: {
						cell: EditableCellRows,
					},
				}}
				pagination={false}
				columns={mergeColumns}
				dataSource={pointLevelData ?? []}
			/>
		</Form>
	)
}

export default PointLevelManagementTable
