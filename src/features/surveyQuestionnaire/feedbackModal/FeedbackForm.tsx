import { Col, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'

interface IFeedbackFormProps {
	form: FormInstance
}

const FeedbackForm = ({ form }: IFeedbackFormProps) => {
	const { t } = useTranslation()

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{
				feedback: '',
			}}
		>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Form.Item name='content' label={t('Label_Content')}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='feedback'
						label={t('Label_Feedback')}
						rules={[
							{
								required: false,
								message: '',
							},
						]}
					>
						<Input maxLength={100} />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export { FeedbackForm }
