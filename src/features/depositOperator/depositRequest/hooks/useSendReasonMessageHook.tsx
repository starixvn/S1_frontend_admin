import { Form, message, Modal, Select } from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { DepositTypeEnum } from 'features/depositLimitation/type'
import {
	useGetDepositReasonMessagesQuery,
	useSetDepositReasonMessageMutation,
} from 'features/depositOperator/api'
import { useTranslation } from 'react-i18next'

const { Option } = Select
const { confirm } = Modal

const useSendReasonMessageHook = ({
	args: { currencyId, transId, depositId, actualDeposit, depositType },
}: {
	args: {
		currencyId: number
		transId: string
		depositId: number
		actualDeposit: number
		depositType: DepositTypeEnum
	}
}) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<{ status: number }>()

	const { data: { data: reasonMessages = [] } = {} } =
		useGetDepositReasonMessagesQuery(null)

	const [setDepositReasonMessage] = useSetDepositReasonMessageMutation()

	const handleSetDepositReasonMessage = async () => {
		if (!siteId) return
		const { status } = await form.validateFields()

		try {
			await setDepositReasonMessage({
				siteId,
				currencyId,
				transId,
				actualDeposit,
				action: depositType,
				after: { depositId, status },
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
				await handleSetDepositReasonMessage()
			},
			onCancel() {
				form.resetFields()
			},
		})
	}
	return { onShowSendMessageModal }
}

export { useSendReasonMessageHook }
