import { FC } from 'react'
import { Col, Collapse, Form, FormInstance, Row, Select, Spin } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	ScratchCardStatusEnum,
	scratchCardStatusList,
} from 'features/bonusManagement/constants'

interface IScratchCardListFilterProps {
	loading: boolean
	form: FormInstance
}
const { Panel } = Collapse
const { Option } = Select

const ScratchCardListFilter: FC<IScratchCardListFilterProps> = ({
	loading,
	form,
}) => {
	const { t } = useTranslation()
	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<Spin spinning={loading}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							form={form}
							layout='vertical'
							initialValues={{
								status: ScratchCardStatusEnum?.All,
							}}
						>
							<Row>
								<Col lg={8} md={12} xs={24}>
									<Form.Item name='status' label={t('Label_Status')}>
										<Select>
											{scratchCardStatusList?.map(status => (
												<Option key={status.value} value={status.value}>
													{t(status.displayName)}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</LayoutContent.Card>
				</Spin>
			</Panel>
		</Collapse>
	)
}

export { ScratchCardListFilter }
