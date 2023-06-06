import { Col, Form, FormInstance, Input, Modal, Row } from 'antd'
import { useTranslation } from 'react-i18next'

interface IEditLoginInfoModalProps {
	form: FormInstance
	loading: boolean
	visible: boolean
	onCancel: () => void
	onSubmit: () => void
	title: string
}

const EditLoginInfoModal = ({
	form,
	loading,
	title,
	visible,
	onCancel,
	onSubmit,
}: IEditLoginInfoModalProps) => {
	const { t } = useTranslation()

	const onClosed = () => {
		form.resetFields()
	}

	return (
		<Modal
			open={visible}
			confirmLoading={loading}
			onOk={onSubmit}
			onCancel={onCancel}
			title={<div style={{ textAlign: 'center' }}>{title}</div>}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			afterClose={onClosed}
		>
			<Form
				form={form}
				layout='vertical'
				size='middle'
				initialValues={{
					loginUrl: '',
					loginAccount: '',
					loginPassword: '',
					transferPin: '',
					loginPin: '',
					corporateId: '',
				}}
			>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name='loginUrl'
							label={t('Label_LoginUrl')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_LoginUrl'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='corporateId'
							label={t('Label_CorporateID')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_CorporateID'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='loginAccount'
							label={t('Label_LoginAccount')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_LoginAccount'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='loginPassword'
							label={t('Label_LoginPassword')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_LoginPassword'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='transferPin' label={t('Label_TransferPin')}>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='loginPin' label={t('Label_LoginPin')}>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export { EditLoginInfoModal }
