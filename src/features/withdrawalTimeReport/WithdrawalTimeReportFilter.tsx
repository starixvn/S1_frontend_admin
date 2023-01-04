import { useTranslation } from 'react-i18next'
import {
	Form,
	Collapse,
	Row,
	Col,
	Input,
	DatePicker,
	Button,
	FormInstance,
	Select,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { Currency } from 'common/enum/type'
import { IEnumTypeData } from 'common/service/enumApi'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { IFilterForm } from 'features/withdrawalTimeReport/type'

interface IWithdrawalTimeReportFilterProps {
	form: FormInstance<IFilterForm>
	currencyListBySite: Currency[]
	timeZoneUtcOffset: number
	statusEnumList: IEnumTypeData[]
	loading: boolean
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

const WithdrawalTimeReportFilter = ({
	form,
	currencyListBySite,
	timeZoneUtcOffset,
	statusEnumList,
	loading,
	onSearch,
	onTimeZoneChange,
}: IWithdrawalTimeReportFilterProps) => {
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
					placeholder={t('Label_Select') + t('Label_Currency')}
					onChange={handleChangeCurrency}
				>
					{currencyListBySite?.length > 1 && (
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

	const withdrawalTimeStatusSelector = () => {
		const handleChangeCurrency = (newStatuses: number[]) => {
			if (newStatuses.includes(0)) {
				form.setFieldsValue({
					statuses: statusEnumList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					statuses: newStatuses,
				})
			}
		}

		return (
			<Form.Item name='statuses' label={t('Label_Status')}>
				<MultipleSelect
					placeholder={t('Label_Select') + t('Label_Status')}
					onChange={handleChangeCurrency}
				>
					{statusEnumList?.length > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}
					{statusEnumList?.map(({ name, value }) => (
						<Option key={value} value={value}>
							{name}
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
							currencyIds: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
							statuses: [],
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={12} md={24} xs={24}>
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
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{withdrawalTimeStatusSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='memberId' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='withdrawalId' label={t('Label_WithdrawalId')}>
									<Input allowClear />
								</Form.Item>
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

export { WithdrawalTimeReportFilter }
