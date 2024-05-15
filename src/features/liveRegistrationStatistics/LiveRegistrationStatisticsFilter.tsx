import { FC, useEffect } from 'react'
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
import { isFunction } from 'lodash'
import { dateRangeToUtcFormatter } from 'common/utils'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import moment from 'moment'
import { UserSite } from 'common/enum/type'
import { dateFormat } from 'common/utils/format'
import {
	selectAdminAllSiteCurrencyList,
	selectCurrencyIdsBySiteIds,
} from 'common/enum'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { useAppSelector } from 'app/store'
import { SearchOutlined } from '@ant-design/icons'
import { useCountdown } from 'usehooks-ts'
import {
	AgentCodeEnum,
	AGENT_CODE_OPTIONS,
	CallOutStatusEnum,
	CALL_OUT_STATUS_OPTIONS,
	DateTypeEnum,
	DATE_TYPE_OPTIONS,
	DepositStatusEnum,
	DEPOSIT_STATUS_OPTIONS,
	DORMANT_MEMBER_OPTIONS,
	REFRESH_DATA_COUNT,
	StatusEnum,
	STATUS_OPTIONS,
} from './constants'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface ILiveRegistrationStatisticsFilterProps {
	loading: boolean
	form: FormInstance
	userSiteList: UserSite[]
	timeZoneUtcOffset: number
	onSearch: (values: any) => void
	onTimeZoneChange: (newUtcOffset: number) => void
	countDownOverCallBack?: () => void
}

const LiveRegistrationStatisticsFilter: FC<
	ILiveRegistrationStatisticsFilterProps
> = ({
	form,
	loading,
	userSiteList,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
	countDownOverCallBack,
}) => {
	const { t } = useTranslation()
	const watchSiteIds = Form.useWatch('siteIds', form)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)
	const adminAllSiteCurrencyList = useAppSelector(
		selectAdminAllSiteCurrencyList
	)

	const [refreshCount, { startCountdown, stopCountdown, resetCountdown }] =
		useCountdown({
			countStart: REFRESH_DATA_COUNT,
		})

	const verifyDate = () => {
		const { dateRange } = form.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange && [dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)

		// 同天ㄧ定大於15 天 不用精確到小時
		return moment(endDate).diff(moment(startDate), 'day') < 15
	}

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

			form.setFieldValue('currencyId', [])
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

					{userSiteList?.map(({ siteId, siteName }) => (
						<Option key={siteId} value={siteId}>
							{siteName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	// * 計時器時間到時送出 callback
	useEffect(() => {
		if (
			verifyDate() &&
			refreshCount === 0 &&
			isFunction(countDownOverCallBack)
		) {
			countDownOverCallBack()
		}
	}, [refreshCount])

	// * 計時器時間到時重置計時器
	useEffect(() => {
		if (verifyDate()) {
			resetCountdown()
			startCountdown()
		}
	}, [loading])

	useEffect(() => {
		return () => stopCountdown()
	}, [])

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
							siteIds: userSiteList.map(({ siteId }) => siteId),
							currencyId: adminAllSiteCurrencyList[0],
							dateType: DateTypeEnum.RegisterDate,
							depositStatus: DepositStatusEnum.All,
							status: StatusEnum.All,
							agentCodeType: AgentCodeEnum.All,
							callOutStatus: CallOutStatusEnum.All,
							dormantUser: undefined,
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
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
												])}
												format={time =>
													moment(time)
														.utcOffset(timeZoneUtcOffset)
														.format(dateFormat)
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
								{siteIdsSelector()}
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='currencyId'
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
									<Select>
										{currencyIdsBySiteIds?.map(currency => (
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
									{verifyDate()
										? `${t('Label_Search')} (${refreshCount})`
										: t('Label_Search')}
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
