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
import {
	selectAdjustmentInfoLogMenu,
	selectCurrencyListBySite,
	selectActionTypeList,
} from 'common/enum'
import { MultipleSelect } from 'components/Select'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface AdjustmentLogReportFilterInterface {
	form: FormInstance<any>
	loading: boolean
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
	onChangeMenus: (newMenus: number[]) => void
	onChangeActionTypes: (newActionTypes: number[]) => void
}

const AdjustmentLogReportFilter: FC<AdjustmentLogReportFilterInterface> = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
	onChangeCurrency,
	onChangeMenus,
	onChangeActionTypes,
}) => {
	const { t } = useTranslation()

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const adjustmentInfoLogMenu = useAppSelector(selectAdjustmentInfoLogMenu)
	const actionTypeList = useAppSelector(selectActionTypeList)

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
							<Col lg={8} md={24} xs={24}>
								<Form.Item name='menus' label={t('Label_Function')}>
									<MultipleSelect
										onChange={onChangeMenus}
										showSearch
										allowClear
										filterOption={(input, option) => {
											const isIncludes: boolean = (
												option!.children as unknown as string
											)
												.toLowerCase()
												.includes(input.toLowerCase())

											return isIncludes
										}}
									>
										{(adjustmentInfoLogMenu?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}

										{adjustmentInfoLogMenu?.map(item => (
											<Option key={item.value} value={item.value}>
												{item.name}
											</Option>
										))}
									</MultipleSelect>
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
								<Form.Item name='actionTypes' label={t('Label_ActionType')}>
									<MultipleSelect onChange={onChangeActionTypes}>
										{(actionTypeList?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}

										{actionTypeList?.map(item => (
											<Option key={item.value} value={item.value}>
												{item.name}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_TransId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_Operator')}>
									<Input allowClear />
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

export { AdjustmentLogReportFilter }
