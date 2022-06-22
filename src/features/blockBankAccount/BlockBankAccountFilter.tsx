import { FC } from 'react'
import moment from 'moment'
import {
	Col,
	Collapse,
	Form,
	FormInstance,
	Input,
	Row,
	DatePicker,
	Button,
	Select,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { BANK_BLOCK_STATUS } from './constants'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface BlockBankAccountFilterInterface {
	loading: boolean
	form: FormInstance<any>
	timeZoneUtcOffset: number
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
	onChangeCurrency: (newCurrencyIds: number[]) => void
}

const BlockBankAccountFilter: FC<BlockBankAccountFilterInterface> = ({
	loading,
	form,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
	onChangeCurrency,
}) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='Search Criteria' key={1}>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							status: 0,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={10} md={24} xs={24}>
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
													'Last 7 Day',
													'This Month',
												])}
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
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='status' label={t('Label_Status')}>
									<Select placeholder='select'>
										{BANK_BLOCK_STATUS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='accountNum' label={t('Label_AccountNum')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='currencyIds' label={t('Label_Currency')}>
									<MultipleSelect onChange={onChangeCurrency}>
										{(currencyListBySite?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}

										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</MultipleSelect>
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

export default BlockBankAccountFilter
