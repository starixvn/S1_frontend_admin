import { head } from 'lodash'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectCurrencyListBySite } from 'common/enum'
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, Form, Row, Select, Typography } from 'antd'
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
			<Panel header='' key='1'>
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
							<Col lg={6} md={12} xs={12}>
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

						<Row justify='space-between' align='middle' gutter={16}>
							<Col>
								<Typography.Text style={{ fontSize: 12 }}>
									{t('Label_HeaderMenu_Product_Description_2')}
								</Typography.Text>
							</Col>

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

							{editPermission?.canUse && (
								<Col>
									<Button
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
