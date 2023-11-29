import {
	Button,
	Checkbox,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Radio,
	Row,
	Select,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import {
	DateTypeEnum,
	dateTypeList,
	GroupByEnum,
	groupByList,
} from 'features/winLostReport/constants'
import { Currency, UserSite } from 'common/enum/type'
import { IGetTpGameTypeData } from 'features/bettingMonitorSetting/type'
import { MultipleSelect } from 'components/Select'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { RangePickerProps } from 'antd/es/date-picker'
import { reject } from 'lodash'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'
import { IMemberTypeData } from 'features/memberAdministrationList/type'
import { IGetCategoryData } from 'features/betList/type'

const { RangePicker } = DatePicker
const { Panel } = Collapse
const { Option } = Select

interface IWinLostReportFilterProps {
	form: FormInstance
	loading: boolean
	tpGameList: IGetTpGameTypeData[]
	categories: IGetCategoryData[]
	memberTypeEnums: IMemberTypeData[]
	currencyListByAllSite: Currency[]
	currencyIdsBySiteIds: Currency[]
	userSiteList: UserSite[]
	timeZoneUtcOffset: number
	selectDate: any

	setSelectDate: (date: any) => void
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void
}

const WinLostReportFilter = ({
	form,
	loading,
	tpGameList,
	categories,
	memberTypeEnums,
	currencyListByAllSite,
	currencyIdsBySiteIds,
	userSiteList,
	timeZoneUtcOffset,
	selectDate,
	setSelectDate,
	onTimeZoneChange,
	onSearch,
}: IWinLostReportFilterProps) => {
	const { t } = useTranslation()

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

	const siteIdsSelector = () => {
		const onSiteIdsChange = (newSiteIds: Array<number | string>) => {
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
		)
	}

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: Array<string | number>) => {
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
			<MultipleSelect
				onChange={onChangeCurrency}
				placeholder={t('Label_Select')}
			>
				{(currencyIdsBySiteIds?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{currencyIdsBySiteIds?.map(({ currencyId, isoCode }) => (
					<Option key={currencyId} value={currencyId}>
						{isoCode}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const categorySelector = () => {
		const onChangeCategory = (newCategory: Array<string | number>) => {
			if (newCategory.includes('all')) {
				form.setFieldsValue({
					tpCategorys: categories.map(({ categoryId }) => categoryId),
				})
			} else {
				form.setFieldsValue({
					tpCategorys: newCategory,
				})
			}
		}
		return (
			<MultipleSelect
				showSearch
				onChange={onChangeCategory}
				placeholder={t('Label_Select')}
				filterOption={(input, option) =>
					(option!.children as unknown as string)
						.toLowerCase()
						.includes(input.toLowerCase())
				}
			>
				{(categories?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{categories?.map(({ categoryId, categoryName }) => (
					<Option key={categoryId} value={categoryId}>
						{categoryName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const productSelector = () => {
		const onChangeProduct = (newTpGameType: Array<string | number>) => {
			if (newTpGameType.includes('all')) {
				form.setFieldsValue({
					tpGameTypes: tpGameList?.map(({ type }) => type),
				})
			} else {
				form.setFieldsValue({
					tpGameTypes: newTpGameType,
				})
			}
		}
		return (
			<MultipleSelect
				showSearch
				onChange={onChangeProduct}
				placeholder={t('Label_Select')}
				filterOption={(input, option) =>
					(option!.children as unknown as string)
						.toLowerCase()
						.includes(input.toLowerCase())
				}
			>
				{(tpGameList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{tpGameList?.map(({ typeName, type }) => (
					<Option key={typeName} value={type}>
						{typeName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const memberTypeSelector = () => {
		const handleChangeMemberType = (newMemberTypes: UserTypeEnum[]) => {
			if (newMemberTypes.includes(0)) {
				form.setFieldsValue({
					memberTypes: memberTypeEnums?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					memberTypes: newMemberTypes,
				})
			}
		}
		return (
			<Form.Item name='memberTypes' label={t('Label_MemberType')}>
				<MultipleSelect
					onChange={handleChangeMemberType}
					placeholder={t('Label_Select') + t('Label_MemberType')}
				>
					{(memberTypeEnums?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{memberTypeEnums?.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={onSearch}
						initialValues={{
							dateType: DateTypeEnum.SettledDate,
							groupBy: GroupByEnum.Date,
							baseCurrencyId: currencyListByAllSite[0]?.currencyId,
							includeFreeSpins: true,
							includeTest: true,
							noDraw: true,
							// 預設排除直播主
							memberTypes: reject(memberTypeEnums, [
								'value',
								UserTypeEnum.LiveStreaming,
							]).map(({ value }) => Number(value)),
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='dateType'
									label={t('Label_DateType')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_DateType'),
											}),
										},
									]}
								>
									<Select placeholder={t('Label_Select')}>
										{dateTypeList.map(({ displayName, value }) => (
											<Option key={value} value={value}>
												{t(displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={8} md={12} xs={12}>
								<Form.Item label={t('Label_DateRange')}>
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
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
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
									{siteIdsSelector()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
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
									{currencySelector()}
								</Form.Item>
							</Col>
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
									<Select placeholder={t('Label_Select')}>
										{currencyListByAllSite?.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='tpCategorys'
									label={t('Label_Category')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Category'),
											}),
										},
									]}
								>
									{categorySelector()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='tpGameTypes'
									label={t('Label_Product')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Product'),
											}),
										},
									]}
								>
									{productSelector()}
								</Form.Item>
							</Col>
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{memberTypeSelector()}
							</Col>
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='includeTest' valuePropName='checked' noStyle>
									<Checkbox>{t('Label_IncludeTestData')}</Checkbox>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='includeFreeSpins'
									valuePropName='checked'
									noStyle
								>
									<Checkbox>{t('Label_IncludeFreeSpins')}</Checkbox>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='noDraw' valuePropName='checked' noStyle>
									<Checkbox>{t('Label_NoDraw')}</Checkbox>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='displayGroupBreakdownInOriginalCurrency'
									valuePropName='checked'
									noStyle
								>
									<Checkbox>
										{t('Label_DisplayGroupBreakdownInOriginalCurrency')}
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>
						<Row align='middle' gutter={16} style={{ marginTop: '10px' }}>
							<Col>
								<Form.Item
									name='groupBy'
									label={t('Label_GroupBy')}
									style={{ margin: 0 }}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_GroupBy'),
											}),
										},
									]}
								>
									<Radio.Group>
										{groupByList?.map(({ value, displayName }) => (
											<Radio key={value} value={value}>
												{t(displayName)}
											</Radio>
										))}
									</Radio.Group>
								</Form.Item>
							</Col>
						</Row>

						<Row justify='end' align='middle' style={{ marginTop: '20px' }}>
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

export default WinLostReportFilter
