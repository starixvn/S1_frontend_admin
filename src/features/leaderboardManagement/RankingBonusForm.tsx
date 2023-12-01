import { Form, FormInstance, Space, Table, Typography } from 'antd'
import { IRankingData } from 'features/leaderboardManagement/type'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { PermissionInterface } from 'type'
import { numberFormatter } from 'common/utils/format'
import { EditableCellRows } from 'components'

interface IRankingBonusFormProps {
	isInEdit: boolean
	form: FormInstance<IRankingData>
	currencyId: number
	loading: boolean
	editingKey: string | undefined
	editPermission?: PermissionInterface
	rankingBonusData: IRankingData[]
	setEditingKey: React.Dispatch<React.SetStateAction<string | undefined>>
	onSave: (currencyId: number) => void
}
const RankingBonusForm = ({
	isInEdit,
	form,
	loading,
	editingKey,
	currencyId,
	setEditingKey,
	editPermission,
	rankingBonusData,
	onSave,
}: IRankingBonusFormProps) => {
	const { t } = useTranslation()
	const onEdit = (record: IRankingData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.ranking)
	}
	const isEditing = (record: IRankingData) => record.ranking === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: '20%',
			align: 'center' as 'center',
			render: (record: IRankingData) => {
				const editable = isEditing(record)

				return editable ? (
					<Space>
						<Typography.Link onClick={() => onSave(currencyId)}>
							{t('Label_Save')}
						</Typography.Link>
						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={!editPermission?.canUse || isInEdit}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Ranking'),
			key: 'ranking',
			dataIndex: 'ranking',
			width: '20%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_MinPayout'),
			key: 'minPoint',
			dataIndex: 'minPoint',
			width: '30%',
			align: 'center' as 'center',
			editable: true,
			render: (minPoint: number) => numberFormatter.format(minPoint) ?? '-',
		},
		{
			title: t('Label_Bonus'),
			key: 'bonus',
			dataIndex: 'bonus',
			width: '30%',
			align: 'center' as 'center',
			editable: true,
			render: (bonus: number) => numberFormatter.format(bonus) ?? '-',
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IRankingData) => ({
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
			{/* 共用的 Table 沒辦法完全關閉 Pagination , 故用原生實作 */}
			<Table
				bordered
				rowClassName='editable-row'
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				components={{
					body: {
						cell: EditableCellRows,
					},
				}}
				dataSource={rankingBonusData}
				pagination={false}
				columns={mergeColumns}
			/>
		</Form>
	)
}

export { RankingBonusForm }
