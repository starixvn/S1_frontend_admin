import { FC, useEffect } from 'react'
import { Form, Input, message, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCheckPasswordMutation } from 'features/balanceAdjustment/balanceAdjustment/api'
import { selectUserSite } from 'common/enum'
import { useAppSelector } from 'app/store'
import { IAxiosError } from 'common/service/axiosBaseQuery'

interface IConfirmPasswordModalProps {
	visible: boolean
	onCancel: () => void
	onFinish: () => void
}

const ConfirmPasswordModal: FC<IConfirmPasswordModalProps> = ({
	visible,
	onCancel,
	onFinish,
}) => {
	const [form] = Form.useForm<{ password: string }>()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { t } = useTranslation()

	const [checkPassword, { isLoading: isCheckPasswordLoading }] =
		useCheckPasswordMutation()

	const handleCheckPassword = async () => {
		if (!siteId) return

		const { password } = await form.validateFields()

		try {
			await checkPassword({ siteId, password }).unwrap()
			onFinish()
			form.resetFields()
		} catch (error) {
			if ((error as IAxiosError)?.errorCode === 1004) {
				message.error(t('System.Label_WrongPassword'))
			} else {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	useEffect(() => {
		if (!visible) {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			visible={visible}
			title={t('Label_ConfirmPassword')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={isCheckPasswordLoading}
			onCancel={onCancel}
			onOk={handleCheckPassword}
		>
			<Form form={form} layout='vertical' initialValues={{ password: '' }}>
				<Form.Item
					label={t('Label_Password')}
					name='password'
					rules={[{ required: true }]}
				>
					<Input allowClear type='password' />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export { ConfirmPasswordModal }
