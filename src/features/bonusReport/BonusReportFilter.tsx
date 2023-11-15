import { useTranslation } from 'react-i18next'
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
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { dateFormat } from 'common/utils/format'
import { MultipleSelect } from 'components/Select'
import { IGetPromotionTypeData } from 'common/service/allDataApi'
import { SearchOutlined } from '@ant-design/icons'
import { onEnumApiMultipleSelectChange } from 'common/utils'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { IEnumTypeData } from 'common/service/enumApi'
import { useAppSelector } from 'app/store'
import { Currency, UserSite } from 'common/enum/type'
import { selectAllSiteEnableCurrencyList } from 'common/enum'
import { STATUS_TYPE_OPTIONS } from './constants'
import { IPromotionCategoryOptionData } from './type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IBonusReportFilterProps {
	form: FormInstance
	loading: boolean
	userSiteList: UserSite[]
	currencyIdsBySiteIds: Currency[]
	promotionList: IGetPromotionTypeData[]
	categories: IPromotionCategoryOptionData[]
	bonusAtPageEnum: IEnumTypeData[]
	timeZoneUtcOffset?: number
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

const BonusReportFilter = ({
	form,
	loading,
	categories,
	userSiteList,
	promotionList,
	bonusAtPageEnum,
	timeZoneUtcOffset,
	currencyIdsBySiteIds,
	onSearch,
	onTimeZoneChange,
}: IBonusReportFilterProps) => {
	const { t } = useTranslation()
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const allStatuses = STATUS_TYPE_OPTIONS?.map(({ value }) => value)

	const onStatusesChange = (newStatuses: number[]) => {
		if (newStatuses.includes(0)) {
			form.setFieldsValue({
				statuses: allStatuses,
			})
		} else {
			form.setFieldsValue({
				statuses: newStatuses,
			})
		}
	}

	const promoCategorySelector = () => {
		const onChangeCategory = (newCategoryIds: Array<number | string>) => {
			if (newCategoryIds.includes('all')) {
				form.setFieldsValue({
					promotionCategoryIds: categories?.map(
						item => item.promotionCategoryId
					),
				})
			} else {
				form.setFieldsValue({
					promotionCategoryIds: newCategoryIds,
				})
			}
		}

		return (
			<Form.Item
				name='promotionCategoryIds'
				label={t('Label_PromotionCategory')}
			>
				<MultipleSelect
					onChange={onChangeCategory}
					placeholder={t('Label_Select')}
				>
					{(categories?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{categories?.map(({ promotionCategoryId, promotionCategoryName }) => (
						<Option key={promotionCategoryId} value={promotionCategoryId}>
							{promotionCategoryName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const promotionTypeSelector = () => {
		const onChangeType = (newTypes: Array<number | string>) => {
			if (newTypes.includes('all')) {
				form.setFieldsValue({
					promotionTypes: promotionList?.map(item => item.type),
				})
			} else {
				form.setFieldsValue({
					promotionTypes: newTypes,
				})
			}
		}

		return (
			<Form.Item name='promotionTypes' label={t('Label_BonusType')}>
				<MultipleSelect onChange={onChangeType} placeholder={t('Label_Select')}>
					{(promotionList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{promotionList?.map(({ type, promotionTypeName }) => (
						<Option key={type} value={type}>
							{promotionTypeName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
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

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyIdsBySiteIds?.map(item => item.currencyId),
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

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							siteIds: userSiteList.map(item => item.siteId),
							// 因為預設 allSite 全選，所以預設值直接先拿全部資料塞值
							currencyIds: currencyListByAllSite?.map(
								({ currencyId }) => currencyId
							),
							baseCurrencyId: 0,
							statuses: allStatuses,
							userName: '',
							transId: '',
							bonusCode: '',
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={12} md={24} xs={24}>
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
												format={dateFormat}
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
						<Row gutter={16} align='middle'>
							<Col lg={6} md={12} xs={12}>
								{siteIdsSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='baseCurrencyId'
									label={t('Label_BaseCurrencyShow')}
								>
									<Select placeholder='select'>
										<Option value={0}>{t('Label_BaseCurrencyShow')}</Option>
										{currencyListByAllSite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{promotionTypeSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='atPages' label={t('Label_GetPage')}>
									<MultipleSelect
										onChange={newValues =>
											onEnumApiMultipleSelectChange(
												newValues,
												bonusAtPageEnum,
												form,
												'atPages'
											)
										}
									>
										{(bonusAtPageEnum?.length as number) > 1 && (
											<Option value='all'>{t('Label_SelectAll')}</Option>
										)}

										{bonusAtPageEnum?.map(({ value, name }) => (
											<Option key={value} value={value}>
												{name}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='statuses' label={t('Label_Status')}>
									<MultipleSelect
										onChange={onStatusesChange}
										placeholder={t('Label_Select')}
									>
										{(currencyListByAllSite?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}
										{STATUS_TYPE_OPTIONS?.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{promoCategorySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_ReferenceId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='bonusCode' label={t('Label_BonusCode')}>
									<Input allowClear />
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

export default BonusReportFilter
