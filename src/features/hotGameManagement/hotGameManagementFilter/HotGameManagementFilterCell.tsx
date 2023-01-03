import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Row,
	Select,
	Spin,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { HotGameContext } from 'features/hotGameManagement/hotGameContext'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'

interface IHotGameManagementFilterCellProps {
	form: FormInstance
}

const { Option } = Select
const { Panel } = Collapse

const HotGameManagementFilterCell = ({
	form,
}: IHotGameManagementFilterCellProps) => {
	const { t } = useTranslation()
	const {
		loading,
		filterLoading,
		tpGameTypeLoading,
		topCategoryList,
		commonTpList,
		tpGameTypeList,
		onSearch,
		isSortMode,
	} = useContext(HotGameContext)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<Spin spinning={filterLoading}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={() => onSearch({})}
						>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='topCategory' label={t('Label_TopCategory')}>
										<Select
											placeholder={t('Label_Select') + t('Label_TopCategory')}
										>
											{topCategoryList.map(
												({ hotGameTopCategoryId, hotGameTopCategoryName }) => (
													<Option
														key={hotGameTopCategoryId}
														value={hotGameTopCategoryId}
													>
														{hotGameTopCategoryName}
													</Option>
												)
											)}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='tpId' label={t('Label_TpName')}>
										<Select
											allowClear
											placeholder={t('Label_Select') + t('Label_TpName')}
											onChange={() => {
												form.resetFields(['tpGameType'])
											}}
										>
											{commonTpList.map(({ id, tpName }) => (
												<Option key={id} value={id}>
													{tpName}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='tpGameType' label={t('Label_TpGameType')}>
										<Select
											allowClear
											loading={tpGameTypeLoading}
											placeholder={t('Label_Select') + t('Label_TpGameType')}
										>
											{tpGameTypeList.map(({ type, typeName }) => (
												<Option value={type} key={type}>
													{typeName}
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
										disabled={isSortMode}
									>
										{t('Label_Search')}
									</Button>
								</Col>
							</Row>
						</Form>
					</LayoutContent.Card>
				</Spin>
			</Panel>
		</Collapse>
	)
}

export { HotGameManagementFilterCell }
