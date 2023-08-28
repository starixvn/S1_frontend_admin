import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { selectCurrencyListBySite } from 'common/enum'
import { Col, Form, FormInstance, Row, Input, Select, Collapse } from 'antd'

interface IActionFormProps {
	form: FormInstance<any>
}

const { Panel } = Collapse
const { Option } = Select

const ActionForm = ({ form }: IActionFormProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form form={form} layout='vertical'>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='currencyId'
									label={t('Label_Currency')}
									rules={[
										{
											required: true,
										},
									]}
								>
									<Select placeholder='select' disabled>
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='depositRewardPercentage'
									label={t('Label_ReferralRewardRate')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='minPayout'
									label={t('Label_MinPayout')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='maxPayout'
									label={t('Label_MaxPayout')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default ActionForm
