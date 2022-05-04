import { FC, useEffect } from 'react'
import { LockOutlined } from '@ant-design/icons'
import { Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

interface UpdateUserPasswordModalProps {
	loading: boolean
	visible: boolean
	onFinish: (values: any) => void
	onCancel: () => void
}

const UpdateUserPasswordModal: FC<UpdateUserPasswordModalProps> = ({
	loading,
	visible,
	onFinish,
	onCancel,
}) => {
	const [form] = Form.useForm()
	const { t } = useTranslation()

	useEffect(() => {
		if (!visible) {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			visible={visible}
			title={t('ChangePassword.Label_ChangePassword')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={() => {
				form.validateFields().then(values => {
					onFinish(values?.newPassword)

					form.resetFields()
				})
			}}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='newPassword'
					rules={[
						{
							required: true,
							message: t('Label_PasswordRequire'),
						},
					]}
				>
					<Input.Password
						allowClear
						prefix={<LockOutlined />}
						type='password'
						placeholder={t('ChangePassword.Label_NewPassword')}
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export { UpdateUserPasswordModal }
