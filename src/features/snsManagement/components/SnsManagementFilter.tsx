import { FC } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Col, Collapse, Form, Row, Select } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'
import { Currency } from 'common/enum/type'
import { head } from 'lodash'

interface ISnsManagementFilterProps {
	form: FormInstance
	currencyListBySite: Currency[]
	disabled: boolean
}

const { Option } = Select
const { Panel } = Collapse
const SnsManagementFilter: FC<ISnsManagementFilterProps> = ({
	form,
	currencyListBySite,
	disabled,
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
						initialValues={{
							currencyId: head(currencyListBySite)?.currencyId,
						}}
						disabled={disabled}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='currencyId' label={t('Label_Currency')}>
									<Select placeholder='select'>
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { SnsManagementFilter }
