import { find, isEmpty } from 'lodash'
import React, { Dispatch, SetStateAction } from 'react'
import {
	Form,
	FormInstance,
	Popconfirm,
	Space,
	Switch,
	Table,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { IPaymentAgentData } from './type'
import { EditableCellRows } from '../../components'
import { LayoutContent } from '../../app/pages/layout'
import { PAYMENT_AGENT_TYPE_LIST, PaymentAgentTypeEnum } from './constants'
import { PermissionInterface } from '../../type'
import { NEW_SITE_PREFIX_URL } from '../../app/config'
import paths from '../../app/constants/paths'

interface IPaymentAgentManagementTableProps {
	loading: boolean
	editingKey: number | undefined
	form: FormInstance
	editPermission?: PermissionInterface
	paymentAgentList: IPaymentAgentData[]
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onRowSaved: () => void
	onSetAgentStatus: ({
		agentId,
		status,
	}: {
		agentId: number
		status: boolean
	}) => void
}

const PaymentAgentManagementTable = ({
	loading,
	editingKey,
	form,
	editPermission,
	paymentAgentList,
	setEditingKey,
	onRowSaved,
	onSetAgentStatus,
}: IPaymentAgentManagementTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IPaymentAgentData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.agentId)
	}

	const isEditing = (record: IPaymentAgentData) => record.agentId === editingKey

	const displayTypeName = (type: number) => {
		return find(
			PAYMENT_AGENT_TYPE_LIST,
			paymentAgentType => paymentAgentType.value === type
		)?.displayName
	}

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
			title: t('Label_Status'),
			key: 'status',
			width: 60,
			align: 'center' as 'center',
			render: (record: IPaymentAgentData) => {
				const { status, type, agentId } = record || {}
				const isShowStatus = type === PaymentAgentTypeEnum.OutSource

				return isShowStatus ? (
					<Popconfirm
						disabled={!editPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => onSetAgentStatus({ agentId, status: !status })}
					>
						<Switch
							checked={Boolean(status)}
							disabled={!editPermission?.canUse}
						/>
					</Popconfirm>
				) : (
					'-'
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
				const displayName = displayTypeName(type)

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
			width: 100,
			align: 'center' as 'center',
			render: (record: IPaymentAgentData) => {
				const { agentId, type } = record || {}
				const isShowUserList = type === PaymentAgentTypeEnum.OutSource
				return isShowUserList ? (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.paymentAgentManagement.sub.AgentNameUserList.root}?agentId=${agentId}`}
						target='_blank'
					>
						{agentId}
					</Typography.Link>
				) : (
					'-'
				)
			},
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IPaymentAgentData) => {
				return {
					record,
					title,
					dataIndex,
					editing: isEditing(record),
					inputType: 'text',
				}
			},
		}
	})

	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Table
					tableLayout='fixed'
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
