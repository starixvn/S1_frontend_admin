import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import {
	Col,
	Collapse,
	Form,
	Input,
	Row,
	DatePicker,
	FormInstance,
	Button,
	Select,
} from 'antd'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { LayoutContent } from 'app/pages/layout'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { SelectOptions, TicketTypeOptions } from './constants'
import { IWorldCupTeams } from './type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface ReferralReportFilterInterface {
	form: FormInstance
	loading: boolean
	timeZoneUtcOffset?: number
	worldCupTeamList: IWorldCupTeams[]
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

const WorldCupMemberReportFilter: FC<ReferralReportFilterInterface> = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	worldCupTeamList,
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
							currencyId: 0,
							ticketType: 0,
							teamId: 0,
							selected: 0,
							userName: '',
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
												showTime
												ranges={MOMENT_RANGE_PICKER_RANGES([
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
								<Form.Item name='currencyId' label={t('Label_Currency')}>
									<Select placeholder={t('Label_Select')}>
										<Option value={0}>{t('Label_SelectAll')}</Option>

										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='ticketType' label={t('Label_TicketType')}>
									<Select placeholder={t('Label_Select')}>
										<Option value={0}>{t('Label_SelectAll')}</Option>

										{TicketTypeOptions?.map(item => (
											<Option key={item.key} value={item.key}>
												{t(item.displayKey, { key: item.key })}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='teamId' label={t('Label_Team')}>
									<Select placeholder={t('Label_Select')}>
										<Option value={0}>{t('Label_SelectAll')}</Option>

										{worldCupTeamList?.map(item => (
											<Option key={item.countryId} value={item.countryId}>
												{item.countryName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='selected' label={t('Label_Selected')}>
									<Select placeholder={t('Label_Select')}>
										<Option value={0}>{t('Label_SelectAll')}</Option>

										{SelectOptions?.map(item => (
											<Option key={item.key} value={item.key}>
												{t(item.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
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

export { WorldCupMemberReportFilter }
