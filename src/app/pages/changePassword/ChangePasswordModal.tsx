import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal } from 'antd'
import { ModalState, useAuth } from 'common/hooks'
import { ChangePasswordForm } from './ChangePasswordForm'

const useForm = (modal: ModalState) => {
	const auth = useAuth()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState<boolean | undefined>()

	const onChangePassword = async () => {
		setLoading(true)

		form.validateFields().then(() => {
			const { oldPassword, newPassword } = form.getFieldsValue()

			auth.onChangePassword({ oldPassword, newPassword })
		})

		setLoading(false)
	}

	useEffect(() => {
		if (!modal.visible) {
			form.resetFields()
		}
	}, [modal.visible])

	return { form, loading, onChangePassword }
}

const ChangePasswordModal: FC<ModalState> = modal => {
	const { t } = useTranslation()
	const { form, loading, onChangePassword } = useForm(modal)

	return (
		<Modal
			title={t('ChangePassword.Label_ChangePassword')}
			visible={modal.visible}
			onOk={onChangePassword}
			confirmLoading={loading}
			onCancel={modal.onCancel}
		>
			<ChangePasswordForm form={form} />
		</Modal>
	)
}

export { ChangePasswordModal }
