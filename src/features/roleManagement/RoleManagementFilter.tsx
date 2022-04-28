import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, Form, FormInstance, Input, Row } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'

const { Panel } = Collapse

const RoleManagementFilter = ({
	loading,
	form,
	onSearch,
}: {
	loading: boolean
	form: FormInstance
	onSearch: (formValues: any) => void
}) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form layout='vertical' form={form} onFinish={onSearch}>
						<Row align='middle' gutter={8}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='roleName' label={t('Label_RoleName')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>

						<Row justify='end' align='middle'>
							<Col>
								<Button
									loading={loading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
								>
									{t('Label_Search')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { RoleManagementFilter }
