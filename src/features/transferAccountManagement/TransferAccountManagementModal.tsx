import moment, { Moment } from 'moment'
import { FC, useEffect } from 'react'
import { Form, message, Modal, Space, Typography } from 'antd'
import { isNaN } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useQueryParams } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import { utcFormatter } from 'common/utils'
import {
	IAddEditForm,
	IBankTransferAccountAgentListResponse,
	IBankTransferAccountData,
} from './type'
import {
	useGetBankTransferAccountAgentListQuery,
	useLazyGetBankTransferAccountByIdQuery,
	useSetBankTransferAccountMutation,
} from './api'
import TransferAccountManagementForm from './TransferAccountManagementForm'

interface ITransferAccountManagementModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
}

const TransferAccountManagementModal: FC<
	ITransferAccountManagementModalProps
> = ({ loading, visible, onCancel }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [form] = Form.useForm<IAddEditForm>()
	// * editId:0 時為新增，其它為編輯

	const [queryParams] = useQueryParams()
	const editId = Number(queryParams?.editId)

	const [
		getBankTransferAccountById,
		{
			data: { data: bankTransferAccount = {} as IBankTransferAccountData } = {},
			isFetching: isGetBankTransferAccountByIdFetching,
		},
	] = useLazyGetBankTransferAccountByIdQuery()

	const [
		setBankTransferAccount,
		{ isLoading: isSetBankTransferAccountLoading },
	] = useSetBankTransferAccountMutation()

	const {
		data: {
			data: agentList = [],
		} = {} as IBankTransferAccountAgentListResponse,
	} = useGetBankTransferAccountAgentListQuery({ siteId })

	const handleSubmit = async () => {
		const { initialTime, ...values } = await form.validateFields()
		const { siteId: recordSiteId } = form.getFieldsValue(true)
		try {
			const response = await setBankTransferAccount({
				id: Number(editId),
				initialTime: utcFormatter({
					date: initialTime as Moment,
					utcOffset: timeZoneUtcOffset,
				}),
				siteId: recordSiteId || siteId,
				...values,
			}).unwrap()

			message.success(response.message ?? t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const { reason, payId, initialTime, ...rest } = bankTransferAccount
		form.setFieldsValue({
			...rest,
			initialTime: moment(initialTime),
			reason: reason === 0 ? undefined : reason,
			payId: payId === 0 ? undefined : payId,
		})
	}, [isGetBankTransferAccountByIdFetching])

	useEffect(() => {
		if (!visible) {
			form.resetFields()
			form.setFieldsValue({
				currencyId: undefined,
				sysId: undefined,
				channel: undefined,
				status: undefined,
				purposes: [],
				accountNo: '',
				initialTime: '',
				agent: '',
				accountCode: '',
				displayName: '',
				initialAmount: undefined,
				maxBalanceAlertAmount: undefined,
				reason: undefined,
				remark: '',
				payId: undefined,
				bankLoginUrl: '',
				bankLoginAccount: '',
				bankLoginPassword: '',
			})
		}
	}, [visible])

	useEffect(() => {
		if (!isNaN(editId) && editId !== 0) {
			getBankTransferAccountById({ id: editId })
		}
	}, [editId])

	return (
		<Modal
			width={660}
			open={visible}
			title='Finance Account Info'
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={handleSubmit}
		>
			<Space style={{ margin: '0 16px', width: '500px' }}>
				<Typography.Text type='danger'>
					{t('Label_EditTransferAccountManagementDescribe1')}
				</Typography.Text>
			</Space>

			<TransferAccountManagementForm
				form={form}
				loading={isSetBankTransferAccountLoading}
				agentList={agentList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
			/>
		</Modal>
	)
}

export default TransferAccountManagementModal
