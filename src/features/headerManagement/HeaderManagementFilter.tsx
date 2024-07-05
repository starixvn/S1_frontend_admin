import { head } from 'lodash'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectCurrencyListBySite } from 'common/enum'
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, Form, Row, Select } from 'antd'
import { IFilterForm, ILobbyCategoryData } from 'features/headerManagement/type'

interface IHeaderManagementFilterProps {
	loading: boolean
	isSortMode: boolean
	form: FormInstance<IFilterForm>
	editPermission?: PermissionInterface
	lobbyCategoryList: ILobbyCategoryData[]
	onSearch: () => {}
	onSetProductStatus: () => void
}

const { Panel } = Collapse
const { Option } = Select

const HeaderManagementFilter = ({
	loading,
	isSortMode,
	form,
	editPermission,
	lobbyCategoryList,
	onSearch,
	onSetProductStatus,
}: IHeaderManagementFilterProps) => {
	const { t } = useTranslation()

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1' data-hm-tour='filter-panel'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch()}
						initialValues={{
							currencyId: head(currencyListBySite)?.currencyId,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12} data-hm-tour='filter-currency'>
								<Form.Item
									name='currencyId'
									label={t('Label_Currency')}
									id='css'
								>
									<Select placeholder='select'>
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12} data-hm-tour='filter-category'>
								<Form.Item
									name='lobbyCategoryId'
									label={t('Label_LobbyCategory')}
								>
									<Select placeholder='select'>
										{lobbyCategoryList.map(({ id, name }) => (
											<Option key={Number(id)} value={Number(id)}>
												{name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<br />

						<Row justify='end' align='middle' gutter={16}>
							<Col>
								<Button
									data-hm-tour='search-button'
									loading={loading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
									disabled={isSortMode}
								>
									{t('Label_Search')}
								</Button>
							</Col>

							{editPermission?.canUse && (
								<Col>
									<Button
										id='css'
										data-hm-tour='status-button'
										type='primary'
										onClick={onSetProductStatus}
										disabled={isSortMode}
									>
										{t('Label_ProductStatus')}
									</Button>
								</Col>
							)}
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default HeaderManagementFilter
