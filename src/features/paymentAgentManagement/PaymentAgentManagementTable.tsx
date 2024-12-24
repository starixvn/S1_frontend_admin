import { find, isEmpty } from 'lodash'
import React, { Dispatch, SetStateAction } from 'react'
import { Form, FormInstance, Space, Table, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { IPaymentAgentData } from './type'
import { EditableCellRows } from '../../components'
import { LayoutContent } from '../../app/pages/layout'
import { PAYMENT_AGENT_TYPE_LIST } from './constants'
import { PermissionInterface } from '../../type'

interface IPaymentAgentManagementTableProps {
	loading: boolean
	editingKey: number | undefined
	form: FormInstance
	editPermission?: PermissionInterface
	paymentAgentList: IPaymentAgentData[]
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onRowSaved: () => void
	onAgentUser: (agentId: number) => void
}

const PaymentAgentManagementTable = ({
	loading,
	editingKey,
	form,
	editPermission,
	paymentAgentList,
	setEditingKey,
	onRowSaved,
	onAgentUser,
}: IPaymentAgentManagementTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IPaymentAgentData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.agentId)
	}

	const isEditing = (record: IPaymentAgentData) => record.agentId === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IPaymentAgentData) => {
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
			title: t('Label_AgentName'),
			key: 'agentName',
			dataIndex: 'agentName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Type'),
			key: 'type',
			dataIndex: 'type',
			width: 100,
			align: 'center' as 'center',
			editable: true,
			render: (type: number) => {
				const displayName = find(
					PAYMENT_AGENT_TYPE_LIST,
					paymentAgentType => paymentAgentType.value === type
				)?.displayName

				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{displayName ? t(displayName) : '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Sites'),
			key: 'siteIds',
			width: 100,
			dataIndex: 'siteIds',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyIds',
			dataIndex: 'currencyIds',
			width: 100,
			align: 'center' as 'center',
			render: (currencyIds: number[]) => {
				return !isEmpty(currencyIds) ? currencyIds : '-'
			},
		},
		{
			title: t('Label_UserList'),
			key: 'agentId',
			dataIndex: 'agentId',
			width: 100,
			align: 'center' as 'center',
			render: (agentId: number) => {
				return (
					<Typography.Link onClick={() => onAgentUser(agentId)}>
						{agentId}
					</Typography.Link>
				)
			},
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IPaymentAgentData) => ({
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
					pagination={false}
					dataSource={paymentAgentList}
					columns={mergeColumns}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default PaymentAgentManagementTable
