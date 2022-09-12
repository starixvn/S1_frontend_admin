import { FC } from 'react'
import { Button, Col, Collapse, Form, FormInstance, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { StatusEnum, statusList } from 'features/hotEventManagement/constants'
import { SearchOutlined } from '@ant-design/icons'

interface IHotEventManagementFilterProps {
	loading: boolean
	form: FormInstance
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const { Panel } = Collapse
const { Option } = Select

const HotEventManagementFilter: FC<IHotEventManagementFilterProps> = ({
	loading,
	form,
	onSearch,
}) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							status: StatusEnum.All,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='status' label={t('Label_Status')}>
									<Select>
										{statusList?.map(status => (
											<Option key={status.value} value={status.value}>
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

export { HotEventManagementFilter }
