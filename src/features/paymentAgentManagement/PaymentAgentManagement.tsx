import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { Card, Form, message } from 'antd'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useLazyGetPaymentAgentListQuery,
	useLazyGetPaymentAgentUserListQuery,
} from './api'
import PaymentAgentManagementFilter from './PaymentAgentManagementFilter'
import PaymentAgentManagementTable from './PaymentAgentManagementTable'
import {
	PAGINATION,
	useAuth,
	useModal,
	useQueryParams,
} from '../../common/hooks'
import { dateRangeToUtcFormatter } from '../../common/utils'
import { useTimeZone } from '../../components/TimeZoneSelect'
import {
	IFilterForm,
	IEditForm,
	IModalForm,
	IPaymentAgentData,
	PaymentAgentResponse,
} from './type'
import { useAppSelector } from '../../app/store'
import { selectUserSite } from '../../common/enum'
import { useLazyGetIovationAssociateAccountQuery } from '../iovation/api'
import PaymentAgentUserListModal from './Modal/PaymentAgentUserListModal'

const PaymentAgentManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()
	const [modalForm] = Form.useForm<IModalForm>()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const agentUserModal = useModal()

	const [
		getPaymentAgentUserList,
		{
			data: { data: paymentAgentUserList = [] } = {},
			isFetching: isGetPaymentAgentUserListFetching,
		},
	] = useLazyGetPaymentAgentUserListQuery()

	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)

	const [
		getPaymentAgentList,
		{
			data: { data: paymentAgentList = [] } = {},
			isFetching: isGetPaymentAgentListFetching,
		},
	] = useLazyGetPaymentAgentListQuery()

	const {
		data: { data: paymentAgentTypeEnum = [] } = {},
		isLoading: isPaymentAgentTypeEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentAgentTypeEnum' })

	const {
		data: { data: paymentAgentStatusEnum = [] } = {},
		isLoading: isPaymentAgentStatusEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentAgentStatusEnum' })

	const handleAgentUser = async (agentId: number) => {
		console.log(agentId)
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
		const { types, status } = form.getFieldsValue()

		try {
			await getPaymentAgentList({
				types,
				status,
			}).unwrap()
			setQueryParams({
				types,
				status,
			})

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleRowSaved = async () => {}
	const handleModalRowSaved = async () => {}

	const filterLoading =
		isPaymentAgentTypeEnumLoading ||
		isGetPaymentAgentListFetching ||
		isPaymentAgentStatusEnumLoading

	const modalLoading = isGetPaymentAgentUserListFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<PaymentAgentManagementFilter
				loading={filterLoading}
				form={form}
				paymentAgentTypeEnum={paymentAgentTypeEnum}
				paymentAgentStatusEnum={paymentAgentStatusEnum}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<PaymentAgentManagementTable
					loading={isGetPaymentAgentListFetching}
					form={editForm}
					editingKey={editingKey}
					editPermission={editPermission}
					paymentAgentList={paymentAgentList}
					setEditingKey={setEditingKey}
					onRowSaved={handleRowSaved}
					onAgentUser={handleAgentUser}
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
