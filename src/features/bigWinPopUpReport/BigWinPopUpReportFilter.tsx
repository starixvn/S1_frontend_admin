import React from 'react'
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
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { selectCurrencyListBySite } from 'common/enum'
import { dateFormat } from 'common/utils/format'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IBigWinPopUpReportFilterProps {
	form: FormInstance
	loading: boolean
	timeZoneUtcOffset?: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
}

const BigWinPopUpReportFilter = ({
	form,
	loading,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: IBigWinPopUpReportFilterProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const currencySelector = () => {
		const handleChangeCurrency = (newCurrencyIds: Array<number | string>) => {
			if (newCurrencyIds.includes('all')) {
				form.setFieldsValue({
					currencyId: currencyListBySite?.map(({ currencyId }) => currencyId),
				})
			} else {
				form.setFieldsValue({
					currencyId: newCurrencyIds,
				})
			}
		}

		return (
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
				<MultipleSelect
					onChange={handleChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyListBySite?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
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
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							currencyId: currencyListBySite.map(
								({ currencyId }) => currencyId
							),
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
												ranges={RANGE_PICKER_RANGES([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
												])}
												format={dateFormat}
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
							<Col lg={8} md={24} xs={24}>
								{currencySelector()}
							</Col>
						</Row>
						<br />
						<Row justify='end' align='middle'>
							<Col>
								<Button
									loading={loading}
									type='primary'
									htmlType='submit'
									icon={<SearchOutlined />}
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

export default BigWinPopUpReportFilter
