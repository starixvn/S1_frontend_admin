import { FC, useEffect } from 'react'
import { Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

interface IConfirmPasswordModalProps {
	loading: boolean
	visible: boolean
	onFinish: (password: string) => void
	onCancel: () => void
}

const ConfirmPasswordModal: FC<IConfirmPasswordModalProps> = ({
	visible,
	loading,
	onCancel,
	onFinish,
}) => {
	const [form] = Form.useForm<{ password: string }>()
	const { t } = useTranslation()

	useEffect(() => {
		if (!visible) {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			title={t('Label_ConfirmPassword')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={() => {
				form.validateFields().then(({ password }) => {
					onFinish(password)

					form.resetFields()
				})
			}}
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

export default ConfirmPasswordModal
