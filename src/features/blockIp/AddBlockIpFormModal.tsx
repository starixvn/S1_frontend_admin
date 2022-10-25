import { FC, useEffect } from 'react'
import { Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateIPAddress } from 'common/utils'

interface IAddBlockIpFormModalProps {
	loading: boolean
	visible: boolean
	onFinish: (ip: string, memo: string) => void
	onCancel: () => void
}

const AddBlockIpFormModal: FC<IAddBlockIpFormModalProps> = ({
	visible,
	loading,
	onCancel,
	onFinish,
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
			open={visible}
			title={t('Label_AddBlockIp')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={() => {
				form.validateFields().then(values => {
					onFinish(values?.ip, values?.memo)

					form.resetFields()
				})
			}}
		>
			<Form form={form} layout='vertical' initialValues={{ ip: '', memo: '' }}>
				<Form.Item
					label={t('Label_Ip')}
					name='ip'
					rules={[
						{ required: true },
						{
							whitespace: true,
							validator: (_validator, value) => {
								return !value || validateIPAddress(value)
									? Promise.resolve()
									: Promise.reject(new Error(t('Label_InputCurrentIpAddress')))
							},
						},
					]}
				>
					<Input allowClear />
				</Form.Item>

				<Form.Item label={t('Label_Memo')} name='memo'>
					<Input allowClear />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default AddBlockIpFormModal
