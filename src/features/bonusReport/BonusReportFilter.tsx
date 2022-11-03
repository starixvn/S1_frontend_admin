import moment from 'moment'
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
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { STATUS_TYPE_OPTIONS } from './constants'
import { IPromotionCategoryOptionData } from './type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IBonusReportFilterProps {
	form: FormInstance
	loading: boolean
	promotionList: IGetPromotionTypeData[]
	categories: IPromotionCategoryOptionData[]
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
	promotionList,
	categories,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: IBonusReportFilterProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
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
							currencyId: 0,
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
													'Last 7 Day',
													'This Month',
												])}
												format={dateFormat}
												onChange={newDateRange =>
													form.setFieldsValue({
														startDate: moment(newDateRange?.[0]),
														endDate: moment(newDateRange?.[1]),
													})
												}
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
								<Form.Item name='currencyId' label={t('Label_Currency')}>
									<Select placeholder='select'>
										<Option value={0}>{t('Label_SelectAll')}</Option>

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
									name='baseCurrencyId'
									label={t('Label_BaseCurrencyShow')}
								>
									<Select placeholder='select'>
										<Option value={0}>{t('Label_BaseCurrencyShow')}</Option>
										{currencyListBySite?.map(item => (
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
								<Form.Item name='statuses' label={t('Label_Status')}>
									<MultipleSelect
										onChange={onStatusesChange}
										placeholder={t('Label_Select')}
									>
										{(currencyListBySite?.length as number) > 1 && (
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
