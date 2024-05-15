import { head } from 'lodash'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { selectCurrencyListBySite } from 'common/enum'
import { MultipleSelect } from 'components/Select'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	Input,
	Row,
	Select,
} from 'antd'
import { IFilterForm } from 'features/confiscatedSummaryReport/type'

interface IConfiscatedSummaryReportFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const ConfiscatedSummaryReportFilter = ({
	form,
	loading,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: IConfiscatedSummaryReportFilterProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: Array<number | string>) => {
			if (newCurrencyIds.includes('all')) {
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
					onChange={onChangeCurrency}
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
			<Panel header='' key={1}>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							currencyIds: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
							baseCurrencyId: head(currencyListBySite)?.currencyId,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={12} md={12} xs={24}>
								<Form.Item label={t('Label_ActiveDate')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										<Form.Item
											noStyle
											name='dateRange'
											initialValue={MOMENT_DATE_RANGES.Today}
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
						</Row>

						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='baseCurrencyId'
									label={t('Label_BaseCurrency')}
								>
									<Select placeholder={t('Label_Select')} allowClear>
										{currencyListBySite?.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
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

export default ConfiscatedSummaryReportFilter
