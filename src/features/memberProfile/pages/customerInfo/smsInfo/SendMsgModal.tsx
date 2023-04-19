import {
	Checkbox,
	Col,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Space,
	Typography,
} from 'antd'
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
	const formPopup = Form.useWatch('isPopup', form)
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
					isPopup: false,
					title: '',
					content: '',
				}}
			>
				<Row justify='center' align='middle'>
					<Col span={24}>
						<Form.Item
							name='title'
							label={
								<Space align='center' size='middle'>
									{t('Label_Subject')}
									<Form.Item name='isPopup' noStyle valuePropName='checked'>
										<Checkbox>{t('Label_Popup')}</Checkbox>
									</Form.Item>
								</Space>
							}
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
					{formPopup && (
						<Col span={24}>
							<Form.Item
								name='popupMessage'
								label={t('Label_PopupMessage')}
								rules={[
									{
										required: true,
										message: '',
									},
								]}
							>
								<Input maxLength={50} />
							</Form.Item>
						</Col>
					)}
				</Row>
				<Row justify='center' align='middle'>
					<Form.Item
						name='content'
						label={t('Label_Content')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_content'),
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
