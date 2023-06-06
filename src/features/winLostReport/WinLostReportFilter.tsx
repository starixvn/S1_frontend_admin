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
import { Currency } from 'common/enum/type'
import { IGetTpGameTypeData } from 'features/bettingMonitorSetting/type'
import { MultipleSelect } from 'components/Select'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { RangePickerProps } from 'antd/es/date-picker'
import moment from 'moment/moment'

const { RangePicker } = DatePicker
const { Panel } = Collapse
const { Option } = Select

interface IWinLostReportFilterProps {
	form: FormInstance
	loading: boolean
	tpGameList: IGetTpGameTypeData[]
	currencyListBySite: Currency[]
	currencyListByAllSite: Currency[]
	timeZoneUtcOffset: number
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
	currencyListBySite,
	currencyListByAllSite,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: IWinLostReportFilterProps) => {
	const { t } = useTranslation()

	const disabledDate: RangePickerProps['disabledDate'] = current => {
		return (
			current > moment().endOf('day') || current < moment().subtract(2, 'month')
		)
	}

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: Array<string | number>) => {
			if (newCurrencyIds.includes('all')) {
				form.setFieldsValue({
					currencyIds: currencyListBySite?.map(({ currencyId }) => currencyId),
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
				{(currencyListBySite?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{currencyListBySite?.map(({ currencyId, isoCode }) => (
					<Option key={currencyId} value={currencyId}>
						{isoCode}
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
				onChange={onChangeProduct}
				placeholder={t('Label_Select')}
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
							currencyIds: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
							baseCurrencyId: currencyListByAllSite[0]?.currencyId,
							includeFreeSpins: true,
							noDraw: true,
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
						<Row align='middle' gutter={16}>
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
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>
						<Row align='middle' gutter={16}>
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
