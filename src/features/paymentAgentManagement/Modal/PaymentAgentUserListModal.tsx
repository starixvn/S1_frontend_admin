import { find, isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormInstance, List, Modal, Space, Table, Typography } from 'antd'
import { EditableCellRows } from '../../../components'
import { LayoutContent } from '../../../app/pages/layout'
import { IPaymentAgentData, IPaymentAgentUserData } from '../type'
import { PAYMENT_AGENT_TYPE_LIST } from '../constants'
import { PermissionInterface } from '../../../type'

interface IPaymentAgentUserListModalProps {
	loading: boolean
	form: FormInstance
	editPermission?: PermissionInterface
	paymentAgentUserList: IPaymentAgentUserData[]
	visible: boolean
	onCancel: () => void
	onModalRowSaved: () => void
}

const PaymentAgentUserListModal = ({
	loading,
	form,
	editPermission,
	paymentAgentUserList,
	visible,
	onCancel,
	onModalRowSaved,
}: IPaymentAgentUserListModalProps) => {
	console.log(paymentAgentUserList)
	const { t } = useTranslation()

	const [modalAgentUserListState, setModalAgentUserListState] = useState<
		IPaymentAgentUserData[]
	>([])
	const [editingModalKey, setEditingModalKey] = useState<number | undefined>(
		undefined
	)

	useEffect(() => {
		if (!loading) {
			setModalAgentUserListState(paymentAgentUserList)
		}
	}, [loading])

	const onClosed = () => {
		setModalAgentUserListState([])
	}

	const onEdit = (record: IPaymentAgentUserData) => {
		form.setFieldsValue({ ...record })
		setEditingModalKey(record.userId)
	}

	const isEditing = (record: IPaymentAgentUserData) =>
		record.userId === editingModalKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IPaymentAgentUserData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={onModalRowSaved}>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link onClick={() => setEditingModalKey(undefined)}>
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
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'userName',
			dataIndex: 'userName',
			width: 60,
			align: 'center' as 'center',
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
			title: t('Label_Group'),
			key: 'groupIds',
			dataIndex: 'groupIds',
			width: 100,
			align: 'center' as 'center',
			editable: true,
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IPaymentAgentUserData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'text',
			}),
		}
	})

	return (
		<Modal
			width='60%'
			open={visible}
			onCancel={onCancel}
			footer={false}
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_AgentNameUserList')}
				</div>
			}
			afterClose={onClosed}
			destroyOnClose
		>
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
						dataSource={modalAgentUserListState}
						columns={mergeColumns}
					/>
				</Form>
			</LayoutContent.Card>
		</Modal>
	)
}

export default PaymentAgentUserListModal
