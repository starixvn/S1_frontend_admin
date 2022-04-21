import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Form, FormInstance, Input, Row } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'

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
		<LayoutContent.Card>
			<Form layout='vertical' form={form} onFinish={onSearch}>
				<Row gutter={24} align='middle'>
					<Col md={6} xs={12}>
						<Form.Item name='roleName' label={t('Label_RoleName')}>
							<Input />
						</Form.Item>
					</Col>
				</Row>

				<Row justify='end' align='middle'>
					<Col>
						<Form.Item>
							<Button
								loading={loading}
								icon={<SearchOutlined />}
								htmlType='submit'
								type='primary'
							>
								{t('Label_Search')}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export { RoleManagementFilter }
