import { FC } from 'react'
import { Col, Form, FormInstance, Row, Input, Select, Collapse } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'

const { Panel } = Collapse
const { Option } = Select

interface ActionFormFormProps {
	form: FormInstance<any>
}

const ActionForm: FC<ActionFormFormProps> = ({ form }) => {
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
									name='bonusAmount'
									label={t('Label_BonusAmount')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='agentValidBet'
									label={t('Label_SettleBetAmount')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='agentDeposit'
									label={t('Label_DepositAmount')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='invitationLimit'
									label={t('Label_InvitationLimit')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='referralFreeCredit'
									label={t('Label_ReferralFreeCredit')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='validBet'
									label={t('Label_ValidBet')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='deposit'
									label={t('Label_ValidityDeposit')}
									rules={[{ required: true }]}
								>
									<Input allowClear type='number' />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='periodDays'
									label={t('Label_PeriodDays')}
									rules={[{ required: true }]}
								>
									<Input allowClear />
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
