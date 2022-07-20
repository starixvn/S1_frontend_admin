import { FC } from 'react'
import { Col, Form, Input, Row, Spin } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { FormInstance } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'

interface ISpecialPasswordFormProps {
	form: FormInstance
	editing: boolean
	loading: boolean
}

const SpecialPasswordManagementForm: FC<ISpecialPasswordFormProps> = ({
	form,
	editing,
	loading,
}) => {
	const { t } = useTranslation()
	return (
		<LayoutContent.Card>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' size='middle' disabled={!editing}>
					<Row align='top' gutter={24}>
						<Col lg={6} md={24} xs={24}>
							<Form.Item
								name='password'
								label={t('Label_Password')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Password'),
										}),
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		</LayoutContent.Card>
	)
}

export { SpecialPasswordManagementForm }
