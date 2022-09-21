import { FC } from 'react'
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
import { useTranslation } from 'react-i18next'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import moment from 'moment'
import { dateFormat } from 'common/utils/format'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { SearchOutlined } from '@ant-design/icons'
import {
	AgentCodeEnum,
	AGENT_CODE_OPTIONS,
	CallOutStatusEnum,
	CALL_OUT_STATUS_OPTIONS,
	DateTypeEnum,
	DATE_TYPE_OPTIONS,
	DepositStatusEnum,
	DEPOSIT_STATUS_OPTIONS,
	DormantMemberEnum,
	DORMANT_MEMBER_OPTIONS,
	StatusEnum,
	STATUS_OPTIONS,
} from './constants'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface ILiveRegistrationStatisticsFilterProps {
	loading: boolean
	refreshCount: number
	form: FormInstance
	timeZoneUtcOffset: number
	onSearch: (values: any) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const LiveRegistrationStatisticsFilter: FC<
	ILiveRegistrationStatisticsFilterProps
> = ({
	loading,
	refreshCount,
	form,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
}) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

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
							currencyId: currencyListBySite[0]?.currencyId,
							dateType: DateTypeEnum.RegisterDate,
							depositStatus: DepositStatusEnum.All,
							status: StatusEnum.All,
							agentCodeType: AgentCodeEnum.All,
							callOutStatus: CallOutStatusEnum.All,
							dormantUser: DormantMemberEnum.All,
							userName: '',
							affiliatesCode: '',
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='dateType' label={t('Label_DateType')}>
									<Select placeholder='select'>
										{DATE_TYPE_OPTIONS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
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
												format={time =>
													moment(time)
														.utcOffset(timeZoneUtcOffset)
														.format(dateFormat)
												}
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
						<Row align='middle' gutter={16}>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='currencyId' label={t('Label_Currency')}>
									<Select>
										{currencyListBySite?.map(currency => (
											<Option
												key={currency.currencyId}
												value={currency.currencyId}
											>
												{currency.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item name='status' label={t('Label_Status')}>
									<Select placeholder='select'>
										{STATUS_OPTIONS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='depositStatus'
									label={t('Label_DepositStatus')}
								>
									<Select placeholder='select'>
										{DEPOSIT_STATUS_OPTIONS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='affiliatesCode'
									label={t('Label_AffiliatesCode')}
								>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='agentCodeType'
									label={t('Label_AgentCodeType')}
								>
									<Select placeholder='select'>
										{AGENT_CODE_OPTIONS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
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
								<Form.Item
									name='callOutStatus'
									label={t('Label_CallOutStatus')}
								>
									<Select placeholder='select'>
										{CALL_OUT_STATUS_OPTIONS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item name='dormantUser' label={t('Label_DormantUser')}>
									<Select placeholder='select' allowClear>
										{DORMANT_MEMBER_OPTIONS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<br />
						<Row justify='end' align='middle' gutter={16}>
							<Col>
								<Button
									loading={loading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
								>
									{`${t('Label_Search')} (${refreshCount})`}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default LiveRegistrationStatisticsFilter
