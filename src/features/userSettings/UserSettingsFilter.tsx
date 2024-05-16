import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import { userSettingStatusList } from './constants'

const { Panel } = Collapse
const { Option } = Select

interface UserSettingsFilterProps {
	form: FormInstance<any>
	loading: boolean
	onSearch: () => void
}

const UserSettingsFilter: FC<UserSettingsFilterProps> = ({
	form,
	loading,
	onSearch,
}) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						form={form}
						onFinish={onSearch}
						initialValues={{ status: true }}
					>
						<Row align='middle' gutter={8}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_UserName')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='status' label={t('Label_Status')}>
									<Select>
										{userSettingStatusList?.map(status => (
											<Option key={status.displayName} value={status.value}>
												{t(status.displayName)}
											</Option>
										))}
									</Select>
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

export { UserSettingsFilter }
