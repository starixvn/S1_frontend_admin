import { FC } from 'react'
import { Col, Form, FormInstance, Input, Row, Switch } from 'antd'
import { LayoutContent } from 'app/pages/layout'

import { useTranslation } from 'react-i18next'

interface InactivePointExpiryFormProps {
	form: FormInstance
	componentDisabled: boolean
	onSetInactivePointExpirySetting: () => void
}

const InactivePointExpiryForm: FC<InactivePointExpiryFormProps> = ({
	form,
	componentDisabled,
	onSetInactivePointExpirySetting,
}) => {
	const { t } = useTranslation()
	return (
		<LayoutContent.Card>
			<Form
				form={form}
				layout='vertical'
				size='middle'
				disabled={componentDisabled}
				onFinish={onSetInactivePointExpirySetting}
			>
				<Row align='middle' gutter={16}>
					<Col lg={6} md={12} xs={12}>
						<Form.Item
							name='days'
							label={t('Label_PointExpiryDay')}
							extra='The information is being validated...'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_PointExpiryDay'),
									}),
								},
							]}
						>
							<Input type='number' />
						</Form.Item>
					</Col>
					<Col lg={3} md={6} xs={6}>
						<Form.Item name='status' label={t('Label_Status')}>
							<Switch />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export default InactivePointExpiryForm
