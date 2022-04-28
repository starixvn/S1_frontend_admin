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
import TimeZoneSelect, { timeZoneLocalOffset } from 'components/TimeZoneSelect'
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
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const AdjustmentLogReportFilter: FC<AdjustmentLogReportFilterInterface> = ({
	form,
	onSearch,
	onTimeZoneChange,
}) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const adjustmentInfoLogMenu = useAppSelector(selectAdjustmentInfoLogMenu)
	const actionTypeList = useAppSelector(selectActionTypeList)

	const onChangeCurrency = (newCurrencyIds: number[]) => {
		if (newCurrencyIds.includes(0)) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(item => item.currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}

	const onChangeMenus = (newMenus: number[]) => {
		if (newMenus.includes(0)) {
			form.setFieldsValue({
				menus: adjustmentInfoLogMenu?.map(item => item.value),
			})
		} else {
			form.setFieldsValue({
				menus: newMenus,
			})
		}
	}

	const onChangeActionTypes = (newActionTypes: number[]) => {
		if (newActionTypes.includes(0)) {
			form.setFieldsValue({
				actionTypes: actionTypeList?.map(item => item.value),
			})
		} else {
			form.setFieldsValue({
				actionTypes: newActionTypes,
			})
		}
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						size='middle'
						layout='vertical'
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
												defaultValue={timeZoneLocalOffset}
												onChange={onTimeZoneChange}
											/>
										</div>
									</Input.Group>
								</Form.Item>
							</Col>

							<Col lg={8} md={12} xs={24}>
								<Form.Item name='menus' label={t('Label_Function')}>
									<MultipleSelect onChange={onChangeMenus}>
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

							<Col lg={8} md={12} xs={24}>
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

							<Col lg={8} md={12} xs={12}>
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

							<Col lg={8} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_TransId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={8} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_Operator')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>

						<br />

						<Row justify='end' align='middle'>
							<Col>
								<Form.Item>
									<Button
										size='middle'
										icon={<SearchOutlined />}
										htmlType='submit'
										type='primary'
									>
										{t('Label_Search')}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { AdjustmentLogReportFilter }
