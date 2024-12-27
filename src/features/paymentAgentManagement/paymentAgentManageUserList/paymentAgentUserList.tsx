import React, { useState } from 'react'
import {
	Form,
	message,
	Popconfirm,
	Space,
	Switch,
	Table,
	Typography,
} from 'antd'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { useAuth, useQueryParams } from '../../../common/hooks'
import { LayoutContent } from '../../../app/pages/layout'
import { EditableCellRows } from '../../../components'
import {
	useGetPaymentAgentUserListQuery,
	useSetPaymentAgentUserMutation,
	useSetPaymentAgentUserStatusMutation,
} from '../api'
import { groupIdMap, PaymentAgentTypeEnum } from '../constants'
import { IModalForm, IPaymentAgentUserData } from '../type'

const PaymentAgentUserList = () => {
	const { t } = useTranslation()
	const { actionPermissions: { setUserAgentPermission } = {} } = useAuth()
	const [form] = Form.useForm<IModalForm>()
	const [queryParams] = useQueryParams()

	const [editingModalKey, setEditingModalKey] = useState<number | undefined>(
		undefined
	)

	const { agentId = 0 } = queryParams

	const onEdit = (record: IPaymentAgentUserData) => {
		form.setFieldsValue({ ...record })
		setEditingModalKey(record.userId)
	}

	const isEditing = (record: IPaymentAgentUserData) =>
		record.userId === editingModalKey

	const {
		data: { data: paymentAgentUserList = [] } = {},
		isFetching: isPaymentAgentUserListFetching,
	} = useGetPaymentAgentUserListQuery({ agentId })

	const [setPaymentAgentUser, { isLoading: isSetPaymentAgentUserLoading }] =
		useSetPaymentAgentUserMutation()

	const [
		setPaymentAgentUserStatus,
		{ isLoading: isSetPaymentAgentUserStatusLoading },
	] = useSetPaymentAgentUserStatusMutation()

	const handleUserListRowSaved = async () => {
		const { userId, userName, password, currencyIds, siteIds, groupIds } =
			form.getFieldsValue(true)
		try {
			await setPaymentAgentUser({
				userId,
				agentId,
				userName,
				password,
				siteIds,
				currencyIds,
				groupIds,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetUserAgentStatus = async ({
		status,
		userId,
	}: {
		status: boolean
		userId: number
	}) => {
		try {
			await setPaymentAgentUserStatus({
				userId,
				status: status
					? PaymentAgentTypeEnum.OutSource
					: PaymentAgentTypeEnum.Internal,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

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
						<Typography.Link onClick={handleUserListRowSaved}>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link onClick={() => setEditingModalKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={!setUserAgentPermission?.canUse}
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
			render: (record: IPaymentAgentUserData) => {
				const { status, userId } = record || {}
				return (
					<Popconfirm
						disabled={!setUserAgentPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() =>
							handleSetUserAgentStatus({ userId, status: !status })
						}
					>
						<Switch
							checked={Boolean(status)}
							disabled={!setUserAgentPermission?.canUse}
						/>
					</Popconfirm>
				)
			},
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
			render: (groupIds?: number[]) => {
				if (!Array.isArray(groupIds) || groupIds.length === 0) {
					return '-'
				}
				// Convert each numeric ID to the matching label; fallback if unrecognized
				const labels = groupIds.map(id => groupIdMap[id] ?? `ID: ${id}`)
				return labels.join(', ')
			},
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

	const loading =
		isPaymentAgentUserListFetching ||
		isSetPaymentAgentUserLoading ||
		isSetPaymentAgentUserStatusLoading

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
					dataSource={paymentAgentUserList}
					columns={mergeColumns}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default PaymentAgentUserList
