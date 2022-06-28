import { FC } from 'react'
import { Col, Form, FormInstance, Input, Row, Switch } from 'antd'
import { LayoutContent } from 'app/pages/layout'

import { useTranslation } from 'react-i18next'

interface RedemptionLimitFormProps {
	form: FormInstance
	componentDisabled: boolean
	onSetRedemptionLimitSetting: () => void
}

const RedemptionLimitForm: FC<RedemptionLimitFormProps> = ({
	form,
	componentDisabled,
	onSetRedemptionLimitSetting,
}) => {
	const { t } = useTranslation()
	const status = Form.useWatch('status', form)
	return (
		<LayoutContent.Card>
			<Form
				form={form}
				layout='vertical'
				size='middle'
				disabled={componentDisabled}
				onFinish={onSetRedemptionLimitSetting}
			>
				<Row align='top' gutter={24}>
					<Col lg={6} md={24} xs={24}>
						<Form.Item
							name='limit'
							label={t('Label_ByMonth')}
							extra={t('Label_RedemptionLimitExtra')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_RedemptionLimit'),
									}),
								},
							]}
						>
							<Input type='number' />
						</Form.Item>
					</Col>
					<Col lg={6} md={6} xs={6}>
						<Form.Item name='status' label={t('Label_Status')}>
							<Switch checked={status} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export default RedemptionLimitForm
