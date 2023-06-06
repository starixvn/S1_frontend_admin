import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Radio,
	Row,
	Select,
	Spin,
} from 'antd'
import { Currency } from 'common/enum/type'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { MultipleSelect } from 'components/Select'
import { GroupByEnum, groupByList } from 'features/bonusInfo/constants'
import { IFilterForm } from 'features/bonusInfo/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { RangePickerProps } from 'antd/es/date-picker'
import moment from 'moment'

interface IBonusInfoFilterProps {
	loading: boolean
	filterLoading: boolean
	form: FormInstance<IFilterForm>
	currencyListBySite: Currency[]
	currencyListByAllSite: Currency[]
	timeZoneUtcOffset: number
	bonusStatusList: IEnumTypeData[]
	bonusTypeList: IEnumTypeData[]
	claimStatusList: IEnumTypeData[]
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: () => void
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const BonusInfoFilter = ({
	loading,
	filterLoading,
	form,
	currencyListBySite,
	currencyListByAllSite,
	timeZoneUtcOffset,
	bonusStatusList,
	bonusTypeList,
	claimStatusList,
	onTimeZoneChange,
	onSearch,
}: IBonusInfoFilterProps) => {
	const { t } = useTranslation()

	const disabledDate: RangePickerProps['disabledDate'] = current => {
		return (
			current > moment().endOf('day') || current < moment().subtract(2, 'month')
		)
	}

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyListBySite?.map(item => item.currencyId),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds,
				})
			}
		}
		return (
			<Form.Item name='currencyIds' label={t('Label_Currency')}>
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyListBySite?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{currencyListBySite?.map(({ currencyId, isoCode }) => (
						<Option key={currencyId} value={currencyId}>
							{isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const bonusTypeSelector = () => {
		const onChangeBonusType = (newType: (number | string)[]) => {
			if (newType.includes('all')) {
				form.setFieldsValue({
					bonusTypes: bonusTypeList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					bonusTypes: newType,
				})
			}
		}
		return (
			<Form.Item name='bonusTypes' label={t('Label_BonusType')}>
				<MultipleSelect
					onChange={onChangeBonusType}
					placeholder={t('Label_Select')}
				>
					{(bonusTypeList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{bonusTypeList?.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const bonusStatusSelector = () => {
		const onChangeBonusStatus = (newStatus: (number | string)[]) => {
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					bonusStatus: bonusStatusList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					bonusStatus: newStatus,
				})
			}
		}
		return (
			<Form.Item name='bonusStatus' label={t('Label_BonusStatus')}>
				<MultipleSelect
					onChange={onChangeBonusStatus}
					placeholder={t('Label_Select')}
				>
					{(bonusStatusList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{bonusStatusList?.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const claimStatusSelector = () => {
		const onChangeClaimStatus = (newStatus: (number | string)[]) => {
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					claimStatuses: claimStatusList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					claimStatuses: newStatus,
				})
			}
		}
		return (
			<Form.Item name='claimStatuses' label={t('Label_ClaimStatus')}>
				<MultipleSelect
					onChange={onChangeClaimStatus}
					placeholder={t('Label_Select')}
				>
					{(claimStatusList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{claimStatusList?.map(({ value, name }) => (
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
				<Spin spinning={filterLoading}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={onSearch}
							initialValues={{
								currencyIds: currencyListBySite?.map(
									({ currencyId }) => currencyId
								),
								baseCurrencyId: 0,
								groupBy: GroupByEnum.BonusCode,
								bonusCode: '',
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={8} md={24} xs={24}>
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
													disabledDate={disabledDate}
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
									{currencySelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item
										name='baseCurrencyId'
										label={t('Label_BaseCurrency')}
									>
										<Select placeholder={t('Label_Select')}>
											<Option key={0} value={0}>
												{t('Label_OriginalCurrency')}
											</Option>
											{currencyListByAllSite?.map(({ currencyId, isoCode }) => (
												<Option key={currencyId} value={currencyId}>
													{isoCode}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='bonusCode' label={t('Label_BonusCode')}>
										<Input />
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									{bonusTypeSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{bonusStatusSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{claimStatusSelector()}
								</Col>
							</Row>
							<Row align='middle' gutter={16}>
								<Col>
									<Form.Item
										name='groupBy'
										label={t('Label_GroupBy')}
										style={{ margin: 0 }}
									>
										<Radio.Group>
											{groupByList?.map(({ value, displayName }) => (
												<Radio value={value} key={value}>
													{t(displayName)}
												</Radio>
											))}
										</Radio.Group>
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
				</Spin>
			</Panel>
		</Collapse>
	)
}

export { BonusInfoFilter }
