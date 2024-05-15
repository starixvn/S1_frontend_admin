import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Spin,
	Radio,
} from 'antd'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { SearchOutlined } from '@ant-design/icons'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { Currency, UserSite } from 'common/enum/type'
import {
	IGetWithdrawalTypeData,
	IFilterForm,
} from 'features/withdrawalPaymentReport/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { IGateWayData } from 'common/service/allDataApi'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IWithdrawalPaymentReportFilterProps {
	loading: boolean
	filterLoading: boolean
	form: FormInstance<IFilterForm>
	timeZoneUtcOffset: number
	userSiteList: UserSite[]
	currencyIdsBySiteIds: Currency[]
	currencyListByAllSite: Currency[]
	groupByList: IEnumTypeData[]
	gateWayList: IGateWayData[]
	getWithdrawalTypeList: IGetWithdrawalTypeData[]
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const WithdrawalPaymentReportFilter = ({
	loading,
	filterLoading,
	form,
	timeZoneUtcOffset,
	userSiteList,
	currencyIdsBySiteIds,
	currencyListByAllSite,
	groupByList,
	gateWayList,
	getWithdrawalTypeList,
	onSearch,
	onTimeZoneChange,
}: IWithdrawalPaymentReportFilterProps) => {
	const { t } = useTranslation()

	const siteIdsSelector = () => {
		const onSiteIdsChange = (newSiteIds: ('all' | number)[]) => {
			if (newSiteIds.includes('all')) {
				form.setFieldsValue({
					siteIds: userSiteList?.map(({ siteId }) => siteId),
				})
			} else {
				form.setFieldsValue({
					siteIds: newSiteIds as number[],
				})
			}
			form.setFieldValue('currencyIds', [])
		}
		return (
			<Form.Item
				name='siteIds'
				label={t('Label_Site')}
				rules={[
					{
						required: true,
						message: t('Label_Required', { key: t('Label_Site') }),
					},
				]}
			>
				<MultipleSelect
					placeholder={t('Label_Select')}
					onChange={onSiteIdsChange}
				>
					{(userSiteList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{userSiteList?.map(({ siteId, siteName }) => (
						<Option key={siteId} value={siteId}>
							{siteName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyIdsBySiteIds?.map(
						({ currencyId }) => currencyId
					),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds,
				})
			}
		}

		return (
			<Form.Item
				name='currencyIds'
				label={t('Label_Currency')}
				rules={[
					{
						required: true,
						message: t('Label_Required', { key: t('Label_Currency') }),
					},
				]}
			>
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyIdsBySiteIds?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{currencyIdsBySiteIds?.map(({ currencyId, isoCode }) => (
						<Option key={currencyId} value={currencyId}>
							{isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const gateWaySelector = () => {
		const handleChangeGateWay = (newGateWay: ('all' | number)[]) => {
			if (newGateWay.includes('all')) {
				form.setFieldsValue({
					payIds: gateWayList?.map(({ payId }) => payId),
				})
			} else {
				form.setFieldsValue({
					payIds: newGateWay as number[],
				})
			}
		}

		return (
			<Form.Item
				name='payIds'
				label={t('Label_PaymentGateway')}
				rules={[
					{
						required: true,
						message: t('Label_Required', { key: t('Label_PaymentGateway') }),
					},
				]}
			>
				<MultipleSelect
					placeholder={t('Label_Select')}
					onChange={handleChangeGateWay}
					filterOption={(input, option) => {
						const isIncludes: boolean = (option!.children as unknown as string)
							.toLowerCase()
							.includes(input.toLowerCase())

						return isIncludes
					}}
				>
					{(gateWayList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{gateWayList?.map(({ payId, payName }) => (
						<Option key={payId} value={payId}>
							{payName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const payTypeSelector = () => {
		const handleChangePayType = (newPayType: ('all' | number)[]) => {
			if (newPayType.includes('all')) {
				form.setFieldsValue({
					types: getWithdrawalTypeList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					types: newPayType as number[],
				})
			}
		}

		return (
			<Form.Item
				name='types'
				label={t('Label_PayType')}
				rules={[
					{
						required: true,
						message: t('Label_Required', { key: t('Label_PayType') }),
					},
				]}
			>
				<MultipleSelect
					placeholder={t('Label_Select')}
					onChange={handleChangePayType}
					filterOption={(input, option) => {
						const isIncludes: boolean = (option!.children as unknown as string)
							.toLowerCase()
							.includes(input.toLowerCase())

						return isIncludes
					}}
				>
					{(getWithdrawalTypeList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{getWithdrawalTypeList?.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Spin spinning={filterLoading}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1'>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={() => onSearch({})}
						>
							<Row align='middle' gutter={16}>
								<Col lg={10} md={24} xs={24}>
									<Form.Item label={t('Label_DateRange')}>
										<Input.Group
											compact
											style={{ width: '100%', display: 'flex' }}
										>
											<Form.Item
												noStyle
												name='dateRange'
												initialValue={DATE_RANGES.Today}
												rules={[
													{
														required: true,
														message: t('Label_DateRangeRequire'),
													},
												]}
											>
												<RangePicker
													style={{ width: '100%' }}
													ranges={RANGE_PICKER_RANGES([
														'Today',
														'Yesterday',
														'Last Week',
														'This Month',
														'Last Month',
													])}
													showTime
												/>
											</Form.Item>
											<div>
												<TimeZoneSelect
													value={timeZoneUtcOffset}
													onChange={onTimeZoneChange}
												/>
											</div>
										</Input.Group>
									</Form.Item>
								</Col>
							</Row>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									{siteIdsSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{currencyIdsSelector()}
								</Col>

								<Col lg={6} md={12} xs={12}>
									{gateWaySelector()}
								</Col>

								<Col lg={6} md={12} xs={12}>
									{payTypeSelector()}
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item name='userNames' label={t('Label_MemberId')}>
										<Input allowClear />
									</Form.Item>
								</Col>
							</Row>

							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item
										name='baseCurrencyId'
										label={t('Label_BaseCurrency')}
										rules={[
											{
												required: true,
												message: t('Label_Required', {
													key: t('Label_BaseCurrency'),
												}),
											},
										]}
									>
										<Select placeholder={t('Label_Select')} allowClear>
											{currencyListByAllSite?.map(({ currencyId, isoCode }) => (
												<Option key={currencyId} value={currencyId}>
													{isoCode}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>

							<Row align='middle' gutter={16}>
								<Col>
									<Form.Item name='groupBy' style={{ margin: 0 }}>
										<Radio.Group>
											{groupByList?.map(({ value, name }) => (
												<Radio key={value} value={name}>
													{name}
												</Radio>
											))}
										</Radio.Group>
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

export default WithdrawalPaymentReportFilter
