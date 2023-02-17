import { Form, message, Modal, Select } from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useTranslation } from 'react-i18next'
import {
	useGetWithdrawalReasonMessagesQuery,
	useSetWithdrawalMessageMutation,
} from 'features/withdrawalOperator/api'

const { Option } = Select
const { confirm } = Modal

const useSendReasonMessageHook = ({
	args: { currencyId, transId, withdrawalId, withdrawalType },
}: {
	args: {
		currencyId: number
		transId: string
		withdrawalId: number
		withdrawalType: number
	}
}) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<{ status: number }>()

	const { data: { data: reasonMessages = [] } = {} } =
		useGetWithdrawalReasonMessagesQuery(null)

	const [setWithdrawalReasonMessage] = useSetWithdrawalMessageMutation()

	const handleSetWithdrawalReasonMessage = async () => {
		if (!siteId) return
		const { status } = await form.validateFields()

		try {
			await setWithdrawalReasonMessage({
				siteId,
				currencyId,
				transId,
				after: { status, withdrawalId, action: withdrawalType },
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		} finally {
			form.resetFields()
		}
	}

	const onShowSendMessageModal = () => {
		confirm({
			title: t('Label_Reason'),
			icon: null,
			content: (
				<Form form={form}>
					<Form.Item
						name='status'
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Reason'),
								}),
							},
						]}
					>
						<Select style={{ width: '100%' }} placeholder='select'>
							{reasonMessages?.map(item => (
								<Option key={item.value} value={item.value}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			),
			onOk: async () => {
				await handleSetWithdrawalReasonMessage()
			},
			onCancel() {
				form.resetFields()
			},
		})
	}
	return { onShowSendMessageModal }
}

export { useSendReasonMessageHook }
