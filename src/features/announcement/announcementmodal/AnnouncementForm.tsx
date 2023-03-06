import { useTranslation } from 'react-i18next'
import { Col, Form, FormInstance, Input, Row } from 'antd'

interface IAnnouncementFormProps {
	form: FormInstance
	langCode: string
	disabled: boolean
}

const { TextArea } = Input

const AnnouncementForm = ({
	form,
	langCode,
	disabled,
}: IAnnouncementFormProps) => {
	const { t } = useTranslation()
	// 只有 en 需要驗證
	const isRequired = langCode === 'en'

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{
				subject: {
					[langCode]: {
						subject: '',
					},
				},
				content: {
					[langCode]: {
						content: '',
					},
				},
			}}
			disabled={disabled}
		>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Form.Item
						name={['subject', langCode, 'subject']}
						label={t('Label_Subject')}
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
						name={['content', langCode, 'content']}
						label={t('Label_Content')}
						rules={[
							{
								required: isRequired,
								message: '',
							},
						]}
					>
						<TextArea rows={6} maxLength={600} />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export default AnnouncementForm
