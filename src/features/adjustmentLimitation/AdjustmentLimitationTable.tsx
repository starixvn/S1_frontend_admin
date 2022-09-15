import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Space, Typography } from 'antd'
import { PermissionInterface } from 'type'
import React from 'react'
import { IGetAdjustmentListData } from 'features/adjustmentLimitation/type'
import { EditableCellRows, Table } from 'components'
import { numberFormatter } from 'common/utils/format'

interface IAdjustmentLimitationTableProps {
	loading: boolean
	form: FormInstance
	editPermission?: PermissionInterface
	onSaved: (before: IGetAdjustmentListData) => void
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
	editingKey: number | undefined
	adjustmentLimitListData: IGetAdjustmentListData[]
}

const AdjustmentLimitationTable = ({
	loading,
	form,
	editPermission,
	onSaved,
	setEditingKey,
	editingKey,
	adjustmentLimitListData,
}: IAdjustmentLimitationTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetAdjustmentListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.currencyId)
	}

	const isEditing = (record: IGetAdjustmentListData) =>
		record.currencyId === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: '30%',
			align: 'center' as 'center',
			render: (record: IGetAdjustmentListData) => {
				const editable = isEditing(record)

				return editable ? (
					<Space>
						<Typography.Link
							onClick={() => onSaved(record)}
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
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: '10%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_AdjustMax') + t('Label_ZeroIsUnLimited'),
			key: 'adjustmentMax',
			dataIndex: 'adjustmentMax',
			align: 'center' as 'center',
			editable: true,
			render: (adjustmentMax: number) =>
				numberFormatter.format(adjustmentMax) ?? '-',
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetAdjustmentListData) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
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
				dataSource={adjustmentLimitListData ?? []}
				pagination={false}
				columns={mergeColumns}
			/>
		</Form>
	)
}

export { AdjustmentLimitationTable }
