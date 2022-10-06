import { Form, FormInstance, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

interface IBlockIPModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	onFinish: () => void
	form: FormInstance
}
const BlockIPModal = ({
	loading,
	visible,
	onCancel,
	form,
	onFinish,
}: IBlockIPModalProps) => {
	const { t } = useTranslation()
	return (
		<Modal
			open={visible}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={onFinish}
		>
			<Form form={form} layout='vertical' initialValues={{ memo: '' }}>
				<Form.Item label={t('Label_Memo')} name='memo'>
					<Input allowClear />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export { BlockIPModal }
