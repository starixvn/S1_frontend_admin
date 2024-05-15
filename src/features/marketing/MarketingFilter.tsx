import { first } from 'lodash'
import moment from 'moment'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { Currency, UserSite } from 'common/enum/type'
import { dateFormat } from 'common/utils/format'
import { MultipleSelect } from 'components/Select'
import { dateRangeToUtcFormatter } from 'common/utils'
import TimeZoneSelect from 'components/TimeZoneSelect'
import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Row,
	Select,
	Input,
	DatePicker,
	Checkbox,
	Space,
} from 'antd'
import { IFilterForm } from 'features/marketing/type'
import { compareDateList, CompareDateEnum } from 'features/marketing/constants'
import { RangePickerProps } from 'antd/es/date-picker'

interface IMpaMarketingFilterProps {
	loading: boolean
	form: FormInstance<IFilterForm>
	timeZoneUtcOffset: number
	currencyListByAllSite: Currency[]
	selectDate: any
	userSiteList: UserSite[]
	currencyIdsBySiteIds: Currency[]
	setSelectDate: (date: any) => void
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const { Panel } = Collapse
const { Option } = Select
const { RangePicker } = DatePicker

const MarketingFilter = ({
	loading,
	form,
	timeZoneUtcOffset,
	currencyListByAllSite,
	selectDate,
	userSiteList,
	currencyIdsBySiteIds,
	setSelectDate,
	onSearch,
	onTimeZoneChange,
}: IMpaMarketingFilterProps) => {
	const { t } = useTranslation()
	const formIsCompared = Form.useWatch('isCompared', form)

	const disabledDate: RangePickerProps['disabledDate'] = current => {
		if (!selectDate) {
			return false
		}
		if (selectDate[0] && current.diff(selectDate[0], 'month') >= 2) return true
		if (selectDate[1] && current.diff(selectDate[1], 'month') <= -2) return true

		return false
	}

	const onOpenChange = (open: boolean) => {
		if (open) {
			setSelectDate([null, null])
			form.setFieldsValue({
				dateRange: undefined,
			})
		} else {
			setSelectDate(null)
		}
	}

	// * siteIds 異動時須清空 currencyIds
	const siteIdsSelector = () => {
		const onChangeSite = (newSiteIds: Array<number | string>) => {
			if (newSiteIds.includes('all')) {
				form.setFieldsValue({
					siteIds: userSiteList?.map(({ siteId }) => siteId),
				})
			} else {
				form.setFieldsValue({
					siteIds: newSiteIds,
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
						message: t('Label_Required', {
							key: t('Label_Site'),
						}),
					},
				]}
			>
				<MultipleSelect onChange={onChangeSite} placeholder={t('Label_Select')}>
					{(userSiteList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{userSiteList?.map(item => (
						<Option key={item.siteId} value={item.siteId}>
							{item.siteName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: Array<number | string>) => {
			if (newCurrencyIds.includes('all')) {
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
						message: t('Label_Required', {
							key: t('Label_Currency'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyIdsBySiteIds?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{currencyIdsBySiteIds?.map(item => (
						<Option key={item.currencyId} value={item.currencyId}>
							{item.isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const handleCompareDateSelector = (compareDateValue: number) => {
		const { dateRange } = form.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange && [dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		// dateRange 間隔幾天則 compareDateRange 就會往後推幾天
		if (compareDateValue === CompareDateEnum.PreviousPeriod) {
			// 因00:00:00 到 23:59:59 需顯示一天 故先精確到小數點在四捨五入到整數才符合以天為單位計算
			const days = Math.round(
				moment(endDate).diff(moment(startDate), 'days', true)
			)
			form.setFieldsValue({
				compareDateRange: [
					moment(startDate).subtract(days, 'days'),
					moment(endDate).subtract(days, 'days'),
				],
			})
		}
		// 往後推一年
		if (compareDateValue === CompareDateEnum.SamePeriodLastYear) {
			form.setFieldsValue({
				compareDateRange: [
					moment(startDate).subtract(1, 'years'),
					moment(endDate).subtract(1, 'year'),
				],
			})
		}
	}

	const handleDateRangeSelector = (dateRangeValue: any) => {
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRangeValue && [
				dateRangeValue[0].startOf('day'),
				dateRangeValue[1].endOf('day'),
			],
			timeZoneUtcOffset
		)

		const days = Math.round(
			moment(endDate).diff(moment(startDate), 'days', true)
		)
		form.setFieldsValue({
			compareDateRange: [
				moment(startDate).subtract(days, 'days'),
				moment(endDate).subtract(days, 'days'),
			],
		})
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
						initialValues={{
							siteIds: userSiteList.map(item => item.siteId),
							isCompared: false,
							periodTime: first(compareDateList)?.value,
							// * 初始使用全部已啟用貨幣
							currencyIds: currencyListByAllSite.map(
								({ currencyId }) => currencyId
							),
							baseCurrencyId: first(currencyListByAllSite)?.currencyId,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_ReportDate')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										<Form.Item
											noStyle
											name='dateRange'
											initialValue={MOMENT_DATE_RANGES.Today}
											rules={[
												{
													required: true,
													message: t('Label_DateRangeRequire'),
												},
											]}
										>
											<RangePicker
												style={{ width: '100%' }}
												ranges={MOMENT_RANGE_PICKER_RANGES([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
												])}
												format={dateFormat}
												onChange={handleDateRangeSelector}
												disabledDate={disabledDate}
												onOpenChange={onOpenChange}
												onCalendarChange={date => setSelectDate(date)}
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
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									label={
										<Space align='center' size={30}>
											<Form.Item
												name='isCompared'
												valuePropName='checked'
												noStyle
											>
												<Checkbox>{t('Label_CompareDate')}</Checkbox>
											</Form.Item>
										</Space>
									}
									name='periodTime'
								>
									<Select
										onChange={handleCompareDateSelector}
										disabled={!formIsCompared}
									>
										{compareDateList?.map(({ displayName, value }) => (
											<Option key={value} value={value}>
												{t(displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_DateRange')}>
									<Form.Item
										noStyle
										name='compareDateRange'
										// 因 DateRange 的預設是一天 故 compareDateRange 向後推一天
										initialValue={[
											moment().subtract(1, 'day').startOf('day'),
											moment().subtract(1, 'day').endOf('day'),
										]}
									>
										<RangePicker
											style={{ width: '100%' }}
											ranges={MOMENT_RANGE_PICKER_RANGES([
												'Today',
												'Yesterday',
												'Last Week',
												'This Month',
												'Last Month',
											])}
											format={dateFormat}
											disabled
										/>
									</Form.Item>
								</Form.Item>
							</Col>
						</Row>

						<Row align='middle' gutter={16}>
							<Col lg={6} md={24} xs={24}>
								{siteIdsSelector()}
							</Col>
							<Col lg={6} md={24} xs={24}>
								{currencyIdsSelector()}
							</Col>

							<Col lg={6} md={24} xs={24}>
								<Form.Item
									name='baseCurrencyId'
									label={t('Label_BaseCurrency')}
									rules={[{ required: true }]}
								>
									<Select placeholder={t('Label_Currency')}>
										{currencyListByAllSite?.map(item => (
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
	)
}

export default MarketingFilter
