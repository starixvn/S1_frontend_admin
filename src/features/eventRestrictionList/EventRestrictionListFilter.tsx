import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Row,
	Select,
	Spin,
	Input,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'

import {
	IFilterForm,
	IGetEventRestrictionListArgs,
} from 'features/eventRestrictionList/type'

const { Panel } = Collapse
const { Option } = Select

interface IExternalDomainFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	handleSearch: (args: IGetEventRestrictionListArgs) => Promise<void>
}

/**
 * EventRestrictionListF 篩選器
 * @param form
 * @param loading 加載狀態
 * @param handleSearch 搜尋函數  */
const EventRestrictionListFilter = ({
	form,
	loading,
	handleSearch,
}: IExternalDomainFilterProps) => {
	/**  ======= 常數 ======= */

	/** 初始 siteId (MYR) */
	const initSiteId = 2

	/**  ======= hooks ======= */

	/** i18n */
	const { t } = useTranslation()

	/** 根據 cookie siteId 過濾出來的幣別 */
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	/** 當前渠道 */
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	/**  ======= 對內函數 ======= */

	/**
	 * 更換使用者名稱
	 * @param event change 事件 */
	const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		// UserName 參數如果是空字串 (代表沒有打任何字) 就設成 null
		const value = event.target.value === '' ? null : event.target.value
		form.setFieldsValue({ username: value })
	}

	/**
	 * 更換選擇的貨幣
	 * @param {number} currencyId  當前選擇幣別 */
	const handleCurrencyChange = (currencyId: number) => {
		form.setFieldsValue({ currencyId })
	}

	return (
		<Spin spinning={loading}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1' style={{ marginTop: 0 }}>
					<LayoutContent.Card>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={() => {
								const { currencyId, username } = form.getFieldsValue()
								const args = {
									SiteId: siteId,
									CurrencyId: currencyId,
									UserName: username,
								}
								handleSearch(args)
							}}
							initialValues={{
								currencyId: initSiteId,
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='username' label={t('Label_UserName')}>
										<Input allowClear onChange={onChangeUsername} />
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='currencyId' label={t('Label_Currency')}>
										<Select
											placeholder='select'
											onChange={handleCurrencyChange}
										>
											{currencyListBySite?.map(item => (
												<Option key={item.currencyId} value={item.currencyId}>
													{item.isoCode}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
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
		</Spin>
	)
}

export default EventRestrictionListFilter
