import { Col, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { TinymceEditor } from 'components'

interface IMessageFormProps {
	form: FormInstance
	langCode: string
}

const MessageForm = ({ form, langCode }: IMessageFormProps) => {
	const { t } = useTranslation()
	const formPopup = Form.useWatch('isPopup', form)
	const defaultContent = Form.useWatch(['messages', langCode, 'Content'], form)
	// 只有 en 需要驗證
	const isRequired = langCode === 'en'

	const onHtmlStateChange = (newHtml: string) => {
		form.setFieldsValue({
			messages: {
				[langCode]: {
					Content: newHtml,
				},
			},
		})
	}

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{
				messages: {
					[langCode]: {
						Title: '',
						Content: '',
						PopupMessage: '',
					},
				},
			}}
		>
			<Row gutter={[16, 16]}>
				{formPopup && (
					<Col span={24}>
						<Form.Item
							// 因應後端資料結構關係，這裡的 key 都要給大駝峰 , 否則後端吃不到 Json 化後的參數
							name={['messages', langCode, 'PopupMessage']}
							label={t('Label_PopupMessage')}
							rules={[
								{
									required: isRequired,
									message: '',
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
				)}
				<Col span={24}>
					<Form.Item
						name={['messages', langCode, 'Title']}
						label={t('Label_Title')}
						rules={[
							{
								required: isRequired,
								message: '',
							},
						]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name={['messages', langCode, 'Content']}
						label={t('Label_Content')}
						rules={[
							{
								required: isRequired,
								message: '',
							},
						]}
					>
						<TinymceEditor
							defaultHtmlState={defaultContent}
							onHtmlStateChange={onHtmlStateChange}
						/>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export { MessageForm }
