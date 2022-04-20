import { Form, FormInstance, Input } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const ChangePasswordForm = ({ form }: { form: FormInstance }) => {
	const { t } = useTranslation()

	return (
		<Form form={form} noValidate layout='vertical' className='login-form'>
			<Form.Item
				label={t('ChangePassword.Label_OldPassword')}
				name='oldPassword'
				rules={[
					{
						required: true,
						message: t('ChangePassword.Label_ErrorMessage_3'),
					},
				]}
			>
				<Input.Password
					prefix={<LockOutlined className='site-form-item-icon' />}
					type='password'
					placeholder={t('ChangePassword.Label_OldPassword')}
				/>
			</Form.Item>
			<Form.Item
				label={t('ChangePassword.Label_NewPassword')}
				name='newPassword'
				rules={[
					{
						required: true,
						message: t('ChangePassword.Label_ErrorMessage_4'),
					},
					{
						validator: () => {
							const { oldPassword, newPassword } = form.getFieldsValue()

							return oldPassword !== newPassword
								? Promise.resolve()
								: Promise.reject(
										new Error(t('ChangePassword.Label_ErrorMessage_1'))
								  )
						},
					},
				]}
			>
				<Input.Password
					prefix={<LockOutlined className='site-form-item-icon' />}
					type='password'
					placeholder={t('ChangePassword.Label_NewPassword')}
				/>
			</Form.Item>
			<Form.Item
				label={t('ChangePassword.Label_ConfirmNewPassword')}
				name='confirmNewPassword'
				rules={[
					{
						required: true,
						message: t('ChangePassword.Label_ErrorMessage_5'),
					},
					{
						validator: () => {
							const { newPassword, confirmNewPassword } = form.getFieldsValue()

							return newPassword === confirmNewPassword
								? Promise.resolve()
								: Promise.reject(
										new Error(t('ChangePassword.Label_ErrorMessage_2'))
								  )
						},
					},
				]}
			>
				<Input.Password
					prefix={<LockOutlined className='site-form-item-icon' />}
					type='password'
					placeholder={t('ChangePassword.Label_ConfirmNewPassword')}
				/>
			</Form.Item>
		</Form>
	)
}

export { ChangePasswordForm }
