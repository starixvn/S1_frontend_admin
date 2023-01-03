import { first } from 'lodash'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Select, Collapse, Form, FormInstance, Col, Button, Row } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { IFilterForm } from 'features/tagManagement/type'
import { STATUS_OPTIONS } from 'features/tagManagement/constants'

interface TagManagementFilterProps {
	loading: boolean
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	form: FormInstance<IFilterForm>
}

const { Option } = Select
const { Panel } = Collapse

const TagManagementFilter = ({
	onSearch,
	form,
	loading,
}: TagManagementFilterProps) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ margin: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
						initialValues={{ status: first(STATUS_OPTIONS)?.value }}
					>
						<Form.Item
							name='status'
							label={t('Label_Status')}
							style={{ margin: 0, width: 200 }}
						>
							<Select placeholder={t('Label_SelectStatus')}>
								{STATUS_OPTIONS.map(({ value, label }) => (
									<Option key={value} value={value}>
										{label}
									</Option>
								))}
							</Select>
						</Form.Item>

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

export default TagManagementFilter
