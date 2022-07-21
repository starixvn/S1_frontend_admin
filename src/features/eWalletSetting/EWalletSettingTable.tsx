import React, { FC } from 'react'
import { Form, FormInstance, Space, Switch, Typography } from 'antd'
import { Table, EditableCellRows } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { IGetEWalletListData } from 'features/eWalletSetting/type'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'

interface IEWalletSettingTableProps {
	form: FormInstance
	loading: boolean
	eWalletList: IGetEWalletListData[]
	editPermission?: PermissionInterface
	onSaved: (before: IGetEWalletListData) => void
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
	editingKey: number | undefined
	onSwitchStatus: (currencyId: number, before: number, after: number) => void
}

const EWalletSettingTable: FC<IEWalletSettingTableProps> = ({
	eWalletList,
	form,
	loading,
	editPermission,
	onSaved,
	setEditingKey,
	editingKey,
	onSwitchStatus,
}) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetEWalletListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.currencyId)
	}

	const isEditing = (record: IGetEWalletListData) =>
		record.currencyId === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetEWalletListData) => {
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
			key: 'currencyId',
			dataIndex: 'currencyId',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_WithdrawalMin'),
			key: 'withdrawalMin',
			dataIndex: 'withdrawalMin',
			width: 80,
			align: 'center' as 'center',
			editable: true,
			render: (withdrawalMin: number) =>
				numberFormatter.format(withdrawalMin) ?? '',
		},
		{
			title: t('Label_WithdrawalMax'),
			key: 'withdrawalMax',
			dataIndex: 'withdrawalMax',
			width: 80,
			align: 'center' as 'center',
			editable: true,
			render: (withdrawalMax: number) =>
				numberFormatter.format(withdrawalMax) ?? '',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (value: IGetEWalletListData) => {
				const { currencyId, status } = value
				const handleSwitchChange = (currentStatus: boolean) => {
					onSwitchStatus(currencyId, status, Number(currentStatus))
				}
				return (
					<Switch
						disabled={!editPermission?.canUse}
						defaultChecked={Boolean(status)}
						onChange={handleSwitchChange}
					/>
				)
			},
		},
	]

	const mergedColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetEWalletListData) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	return (
		<LayoutContent.Card
			style={{ paddingTop: '20px', paddingBottom: '20px', marginTop: 0 }}
		>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					loading={loading}
					columns={mergedColumns}
					dataSource={eWalletList ?? []}
					pagination={false}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { EWalletSettingTable }
