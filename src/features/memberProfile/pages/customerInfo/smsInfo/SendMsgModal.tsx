import { Col, Form, FormInstance, Input, Modal, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { TinymceEditor } from 'components'

interface ISendMsgModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	onFinish: () => void
	form: FormInstance
	langCode: string
}

const SendMsgModal = ({
	visible,
	onCancel,
	onFinish,
	loading,
	form,
	langCode,
}: ISendMsgModalProps) => {
	const { t } = useTranslation()
	const onHtmlStateChange = (newHtml: string) => {
		form.setFieldsValue({
			content: newHtml,
		})
	}

	return (
		<Modal
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_SendPersonalMsg')}</div>
			}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			width='60vw'
			onOk={onFinish}
		>
			<Row style={{ marginBottom: '10px' }}>
				<Typography.Title level={5}>{`${t('Label_UserPreferLanguage')} : ${
					langCode ?? ''
				}`}</Typography.Title>
			</Row>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					title: '',
					content: '',
				}}
			>
				<Row justify='center' align='middle'>
					<Col span={24}>
						<Form.Item
							name='title'
							label={t('Label_Subject')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Subject'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
				<Row justify='center' align='middle'>
					<Form.Item
						name='content'
						label={t('Label_Content')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('content'),
								}),
							},
						]}
					>
						<TinymceEditor onHtmlStateChange={onHtmlStateChange} />
					</Form.Item>
				</Row>
			</Form>
		</Modal>
	)
}

export { SendMsgModal }
