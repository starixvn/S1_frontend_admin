import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
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
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import React from 'react'
import { IDrawPrizesEventName } from 'features/bonusExport/type'

interface IDrawPrizeReportFilterProps {
	loading: boolean
	form: FormInstance
	timeZoneUtcOffset: number
	currencyListBySite: Currency[]
	drawPrizesEventNames: IDrawPrizesEventName[]
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

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const DrawPrizeReportFilter = ({
	loading,
	form,
	timeZoneUtcOffset,
	currencyListBySite,
	drawPrizesEventNames,
	onSearch,
	onTimeZoneChange,
}: IDrawPrizeReportFilterProps) => {
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

	const eventNameSelector = () => {
		const handleChangeEvents = (newEvents: string[]) => {
			if (newEvents.includes('all')) {
				form.setFieldsValue({
					eventNames: drawPrizesEventNames?.map(({ eventName }) => eventName),
				})
			} else {
				form.setFieldsValue({
					eventNames: newEvents,
				})
			}
		}
		return (
			<Form.Item name='eventNames' label={t('Label_EventName')}>
				<MultipleSelect
					onChange={handleChangeEvents}
					placeholder={t('Label_Select') + t('Label_EventName')}
				>
					{(drawPrizesEventNames?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{drawPrizesEventNames?.map(({ eventName }) => (
						<Option key={eventName} value={eventName}>
							{eventName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
						initialValues={{
							currencyIds: currencyListBySite.map(
								({ currencyId }) => currencyId
							),
						}}
					>
						<Row gutter={16}>
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
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{eventNameSelector()}
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

export { DrawPrizeReportFilter }
