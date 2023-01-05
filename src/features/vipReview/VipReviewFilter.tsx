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
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { IFilterForm } from 'features/vipReview/type'
import { IEnumTypeData } from 'common/service/enumApi'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { VipTypeEnum, vipTypeList } from 'features/vipReview/constants'
import { useTranslation } from 'react-i18next'

interface IVipReviewFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	type: number
	currencyListBySite: Currency[]
	vipStatusList: IEnumTypeData[]
	timeZoneUtcOffset: number
	selectDate: any
	setSelectDate: (date: any) => void
	resetQueryParams: () => void
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

const { Panel } = Collapse
const { Option } = Select
const { RangePicker } = DatePicker

const VipReviewFilter = ({
	form,
	loading,
	type,
	currencyListBySite,
	vipStatusList,
	timeZoneUtcOffset,
	selectDate,
	setSelectDate,
	resetQueryParams,
	onTimeZoneChange,
	onSearch,
}: IVipReviewFilterProps) => {
	const { t } = useTranslation()

	const disabledDate = (current: moment.Moment) => {
		if (!selectDate) {
			return false
		}
		const tooLate = selectDate[0] && current.diff(selectDate[0], 'month') > 1
		const tooEarly = selectDate[1] && selectDate[1].diff(current, 'month') > 1
		return !!tooEarly || !!tooLate
	}

	const onOpenChange = (open: boolean) => {
		if (open) {
			setSelectDate([null, null])
		} else {
			setSelectDate(null)
		}
	}

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: Array<number | string>) => {
			if (newCurrencyIds.includes('all')) {
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
					{(currencyListBySite?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
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

	const typeSelector = () => {
		const onChangeType = () => {
			form.resetFields(['dateRange1', 'dateRange2'])
			resetQueryParams()
		}
		return (
			<Form.Item
				name='type'
				label={t('Label_Type')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Type'),
						}),
					},
				]}
			>
				<Select onChange={onChangeType} placeholder={t('Label_Select')}>
					{vipTypeList?.map(({ label, value }) => (
						<Option key={value} value={value}>
							{t(label)}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	const statusSelector = () => {
		const onChangeStatus = (newStatus: Array<number | string>) => {
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					status: vipStatusList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					status: newStatus,
				})
			}
		}
		return (
			<Form.Item
				name='status'
				label={t('Label_Status')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Status'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={onChangeStatus}
					placeholder={t('Label_Select')}
				>
					{(vipStatusList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{vipStatusList?.map(({ name, value }) => (
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
				<LayoutContent.Card>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={onSearch}
						initialValues={{
							currencyIds: currencyListBySite.map(
								({ currencyId }) => currencyId
							),
							type: vipTypeList[0].value,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_DateRange')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										{type === VipTypeEnum.Upgrade ? (
											<Form.Item
												noStyle
												name='dateRange1'
												rules={[
													{
														required: true,
														message: t('Label_DateRangeRequire'),
													},
												]}
											>
												<DatePicker style={{ width: '100%' }} picker='month' />
											</Form.Item>
										) : (
											<Form.Item
												noStyle
												name='dateRange2'
												rules={[
													{
														required: true,
														message: t('Label_DateRangeRequire'),
													},
												]}
											>
												<RangePicker
													style={{ width: '100%' }}
													picker='month'
													onCalendarChange={date => setSelectDate(date)}
													onOpenChange={onOpenChange}
													disabledDate={disabledDate}
												/>
											</Form.Item>
										)}
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
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{typeSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{statusSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
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

export default VipReviewFilter
