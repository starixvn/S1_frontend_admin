import { LayoutContent } from 'app/pages/layout'
import { Col, Collapse, Form, FormInstance, Row, Select, Spin } from 'antd'
import {
	IFilterForm,
	IGetDeepLinkListData,
} from 'features/providerAppDownload/type'
import { useTranslation } from 'react-i18next'

interface IProviderAppDownloadFilterProps {
	loading: boolean
	form: FormInstance<IFilterForm>
	deepLinkList: IGetDeepLinkListData[]
}

const { Panel } = Collapse
const { Option } = Select

const ProviderAppDownloadFilter = ({
	loading,
	deepLinkList,
	form,
}: IProviderAppDownloadFilterProps) => {
	const { t } = useTranslation()
	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<Spin spinning={loading}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form layout='vertical' size='middle' form={form}>
							<Row gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='deepLinkId' label={t('Label_DeepLinkType')}>
										<Select>
											{deepLinkList.map(({ id, name }) => (
												<Option key={id} value={id}>
													{name}
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

export { ProviderAppDownloadFilter }
