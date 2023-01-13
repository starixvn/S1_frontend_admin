import { Form, FormInstance, Space, Typography } from 'antd'
import { EditableCellRows, Table } from 'components'
import { IGetWithdrawalKycListData } from 'features/withdrawalKycControl/type'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import { numberFormatter } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'

interface IWithdrawalKycControlTableProps {
	loading: boolean
	form: FormInstance
	withdrawalKycListData: IGetWithdrawalKycListData[]
	editPermission?: PermissionInterface
	onSaved: (before: IGetWithdrawalKycListData) => void
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
	editingKey: number | undefined
}

const WithdrawalKycControlTable = ({
	loading,
	form,
	withdrawalKycListData,
	editPermission,
	onSaved,
	setEditingKey,
	editingKey,
}: IWithdrawalKycControlTableProps): JSX.Element => {
	const { t } = useTranslation()

	const onEdit = (record: IGetWithdrawalKycListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.currencyId)
	}
	const isEditing = (record: IGetWithdrawalKycListData) =>
		record.currencyId === editingKey
	const columns = [
		{
			title: t('Label_Action'),
			width: '33%',
			key: 'operation',
			align: 'center' as 'center',
			render: (record: IGetWithdrawalKycListData) => {
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
			width: '33%',
			key: 'isoCode',
			dataIndex: 'isoCode',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			width: '33%',
			dataIndex: 'amount',
			align: 'center' as 'center',
			editable: true,
			render: (amount: number) => numberFormatter.format(amount) ?? '-',
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetWithdrawalKycListData) => ({
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
					dataSource={withdrawalKycListData ?? []}
					pagination={false}
					columns={mergeColumns}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { WithdrawalKycControlTable }
