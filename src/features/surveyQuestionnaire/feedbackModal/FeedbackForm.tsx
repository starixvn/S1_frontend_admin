import { Col, Form, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'

interface IFeedbackFormProps {
	editPermission?: PermissionInterface
}

const FeedbackForm = ({ editPermission }: IFeedbackFormProps) => {
	const { t } = useTranslation()

	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<Form.Item name='content' label={t('Label_Content')}>
					<Input.TextArea rows={6} disabled />
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item
					name='feedback'
					label={t('Label_Feedback')}
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_Feedback'),
							}),
						},
					]}
				>
					<Input maxLength={100} disabled={!editPermission?.canUse} />
				</Form.Item>
			</Col>
		</Row>
	)
}

export { FeedbackForm }
