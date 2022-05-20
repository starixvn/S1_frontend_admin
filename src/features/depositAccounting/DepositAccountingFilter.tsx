import React, { FC } from 'react'
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
import moment from 'moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { MultipleSelect } from 'components/Select'
import { SearchOutlined } from '@ant-design/icons'
import { PermissionInterface } from 'type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IDepositAccountingFilterProps {
	viewPermission?: PermissionInterface
	loading: boolean
	form: FormInstance<any>
	timeZoneUtcOffset: number
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
	onChangeCurrency: (newCurrencyIds: number[]) => void
}
const DepositAccountingFilter: FC<IDepositAccountingFilterProps> = ({
	viewPermission,
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

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_TransId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>

						<br />

						<Row justify='end' align='middle'>
							<Col>
								<Button
									disabled={!viewPermission?.canUse}
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

export default DepositAccountingFilter
