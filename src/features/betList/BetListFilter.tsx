import { FC } from 'react'
import moment from 'moment'
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
import { MultipleSelect } from 'components/Select'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface BetListFilterInterface {
	form: FormInstance<any>
	loading: boolean
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
	onChangeCurrency: (newCurrencyIds: number[]) => void
}

const BetListFilter: FC<BetListFilterInterface> = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
	onChangeCurrency,
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
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='currencyIds' label={t('Label_Currency')}>
									<MultipleSelect defaultValue={0} onChange={onChangeCurrency}>
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
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='product' label={t('Label_Product')}>
									<Select placeholder='Select' defaultValue={0}>
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
								<Form.Item name='provider' label={t('Label_Provider')}>
									<Select placeholder='Select' defaultValue={0}>
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
								<Form.Item name='category' label={t('Label_Category')}>
									<Select placeholder='Select' defaultValue={0}>
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
								<Form.Item name='category' label={t('Label_Game')}>
									<Select placeholder='Select' defaultValue={0}>
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
								<Form.Item name='title' label={t('Label_Title')}>
									<Input allowClear placeholder={t('Label_Title')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='matchId' label={t('Label_MatchId')}>
									<Input allowClear placeholder={t('Label_MatchId')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='betType' label={t('Label_BetType')}>
									<Input allowClear placeholder={t('Label_BetType')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='stake' label={t('Label_StakeRange')}>
									<Input allowClear placeholder={t('Label_StakeRange')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='winlostAmount' label={t('Label_WinLoseRange')}>
									<Input allowClear placeholder={t('Label_WinLoseRange')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='tpId' label={t('Label_ProviderId')}>
									<Input allowClear placeholder={t('Label_ProviderId')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='sabaId' label={t('Label_SabeId')}>
									<Input allowClear placeholder={t('Label_SabeId')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='refNo' label={t('Label_RefNo')}>
									<Input allowClear placeholder={t('Label_RefNo')} />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='viPlevel' label={t('LabeL_VipLevel')}>
									<Select placeholder='Select' defaultValue={0}>
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
								<Form.Item name='tags' label={t('Label_Tag')}>
									<MultipleSelect defaultValue={0} onChange={onChangeCurrency}>
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

export { BetListFilter }
