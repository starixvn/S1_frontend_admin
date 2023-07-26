import { Currency } from 'common/enum/type'
import { Button, Col, Collapse, Form, FormInstance, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { head } from 'lodash'
import { SearchOutlined } from '@ant-design/icons'

interface IRebateExcludeGameFilterProps {
	loading: boolean
	isEdit: boolean
	form: FormInstance<{ currencyId: number }>
	currencyListBySite: Currency[]
	onSearch: () => void
}

const { Panel } = Collapse
const { Option } = Select

const RebateExcludeGameFilter = ({
	isEdit,
	loading,
	form,
	currencyListBySite,
	onSearch,
}: IRebateExcludeGameFilterProps) => {
	const { t } = useTranslation()
	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={onSearch}
						initialValues={{
							currencyId: head(currencyListBySite)?.currencyId,
						}}
						disabled={isEdit}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={24}>
								<Form.Item
									name='currencyId'
									label={t('Label_Currency')}
									rules={[{ required: true }]}
								>
									<Select placeholder={t('Label_Currency')}>
										{currencyListBySite?.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<br />
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

export { RebateExcludeGameFilter }
