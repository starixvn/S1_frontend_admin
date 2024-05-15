import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { IEnumTypeData } from 'common/service/enumApi'
import { IForm } from './type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IOtpVerificationReportFilterProps {
	enumLoading: boolean
	loading: boolean
	form: FormInstance<IForm>
	currencyListBySite: Currency[]
	otpProviderEnum: IEnumTypeData[]
	otpStatusEnum: IEnumTypeData[]
	timeZoneUtcOffset?: number
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const OtpVerificationReportFilter = ({
	enumLoading,
	loading,
	form,
	currencyListBySite,
	otpProviderEnum,
	otpStatusEnum,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
}: IOtpVerificationReportFilterProps) => {
	const { t } = useTranslation()

	const currencySelector = () => {
		const handleChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
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
			<Form.Item name='currencyIds' label={t('Label_Currency')}>
				<MultipleSelect
					onChange={handleChangeCurrency}
					placeholder={t('Label_Select') + t('Label_Currency')}
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

	return (
		<Spin spinning={enumLoading}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1'>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							initialValues={{
								currencyIds: currencyListBySite.map(
									({ currencyId }) => currencyId
								),
							}}
							onFinish={() => onSearch({})}
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
													showTime
													ranges={RANGE_PICKER_RANGES([
														'Today',
														'Yesterday',
														'Last Week',
														'This Month',
														'Last Month',
													])}
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
								<Col lg={4} md={12} xs={12}>
									{currencySelector()}
								</Col>
								<Col lg={4} md={12} xs={12}>
									<Form.Item name='otpProvider' label={t('Label_Provider')}>
										<Select placeholder={t('Label_Select')} allowClear>
											{otpProviderEnum?.map(({ name, value }) => (
												<Option key={value} value={value}>
													{name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={4} md={12} xs={12}>
									<Form.Item name='otpStatus' label={t('Label_Status')}>
										<Select placeholder={t('Label_Select')} allowClear>
											{otpStatusEnum?.map(({ name, value }) => (
												<Option key={value} value={value}>
													{name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={4} md={12} xs={12}>
									<Form.Item name='userName' label={t('Label_MemberId')}>
										<Input allowClear />
									</Form.Item>
								</Col>
								<Col lg={4} md={12} xs={12}>
									<Form.Item name='phoneNo' label={t('Label_PhoneNo')}>
										<InputNumber controls={false} style={{ width: '100%' }} />
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
		</Spin>
	)
}

export default OtpVerificationReportFilter
