import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useLazyGetPaymentAgentListQuery,
	useLazyGetPaymentAgentUserListQuery,
	useSetPaymentAgentStatusMutation,
	useSetPaymentAgentMutation,
} from './api'
import PaymentAgentManagementFilter from './PaymentAgentManagementFilter'
import PaymentAgentManagementTable from './PaymentAgentManagementTable'
import { useAuth, useModal, useQueryParams } from '../../common/hooks'
import {
	IFilterForm,
	IEditForm,
	IModalForm,
	IPaymentAgentUserData,
	IPaymentAgentUserResponse,
} from './type'
import PaymentAgentUserListModal from './Modal/PaymentAgentUserListModal'
import { PaymentAgentTypeEnum } from './constants'

const PaymentAgentManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()
	const [modalForm] = Form.useForm<IModalForm>()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission, setUserAgentPermission } = {} } =
		useAuth()

	const agentUserModal = useModal()

	const [
		getPaymentAgentUserList,
		{
			data: { data: paymentAgentUserList = [] } = {},
			isFetching: isGetPaymentAgentUserListFetching,
		},
	] = useLazyGetPaymentAgentUserListQuery()

	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)

	const [
		getPaymentAgentList,
		{
			data: { data: paymentAgentList = [] } = {},
			isFetching: isGetPaymentAgentListFetching,
		},
	] = useLazyGetPaymentAgentListQuery()

	const [setPaymentAgentStatus, { isLoading: isSetPaymentAgentStatusLoading }] =
		useSetPaymentAgentStatusMutation()

	const [setPaymentAgent, { isLoading: isSetPaymentAgentLoading }] =
		useSetPaymentAgentMutation()

	const {
		data: { data: paymentAgentTypeEnum = [] } = {},
		isLoading: isPaymentAgentTypeEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentAgentTypeEnum' })

	const {
		data: { data: paymentAgentStatusEnum = [] } = {},
		isLoading: isPaymentAgentStatusEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentAgentStatusEnum' })

	const handleAgentUser = async (agentId: number) => {
		agentUserModal.onOpen()
		try {
			await getPaymentAgentUserList({ agentId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSearch = async () => {
		const { types, status } = filterForm.getFieldsValue()

		try {
			await getPaymentAgentList({
				types,
				status,
			}).unwrap()
			setQueryParams({
				types,
				status,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleRowSaved = async () => {
		const { agentId, agentName, type, siteIds, currencyIds, status } =
			editForm.getFieldsValue(true)
		try {
			await setPaymentAgent({
				agentId,
				agentName,
				type,
				siteIds,
				currencyIds,
				status,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	const handleModalRowSaved = async () => {}
	const handleSetAgentStatus = async ({
		agentId,
		status,
	}: {
		agentId: number
		status: boolean
	}) => {
		try {
			await setPaymentAgentStatus({
				agentId,
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

	const filterLoading =
		isPaymentAgentTypeEnumLoading || isPaymentAgentStatusEnumLoading

	const tableLoading =
		isGetPaymentAgentListFetching ||
		isSetPaymentAgentStatusLoading ||
		isSetPaymentAgentLoading

	const modalLoading = isGetPaymentAgentUserListFetching

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					types: paymentAgentTypeEnum?.map(({ value }) => value),
					status: paymentAgentStatusEnum?.map(({ value }) => value),
				})
			} else {
				const { types = [], status = [] } = queryParams
				filterForm.setFieldsValue({
					types: types.map((value: string) => Number(value)),
					status: status.map((value: string) => Number(value)),
				})

				handleSearch()
			}
		}
		if (!filterLoading) {
			init()
		}
	}, [filterLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<PaymentAgentManagementFilter
				loading={filterLoading}
				form={filterForm}
				paymentAgentTypeEnum={paymentAgentTypeEnum}
				paymentAgentStatusEnum={paymentAgentStatusEnum}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<PaymentAgentManagementTable
					loading={tableLoading}
					form={editForm}
					editingKey={editingKey}
					editPermission={editPermission}
					paymentAgentList={paymentAgentList}
					setEditingKey={setEditingKey}
					onRowSaved={handleRowSaved}
					onAgentUser={handleAgentUser}
					onSetAgentStatus={handleSetAgentStatus}
				/>
			)}

			<PaymentAgentUserListModal
				loading={modalLoading}
				form={modalForm}
				editPermission={editPermission}
				paymentAgentUserList={paymentAgentUserList}
				visible={agentUserModal.visible}
				onCancel={agentUserModal.onCancel}
				onModalRowSaved={handleModalRowSaved}
			/>
		</LayoutContent.Main>
	)
}

export default PaymentAgentManagement
