import { useTranslation } from 'react-i18next'
import {
	Collapse,
	Form,
	Row,
	Col,
	Input,
	DatePicker,
	Select,
	FormInstance,
	Button,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { Currency } from 'common/enum/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { MultipleSelect } from 'components/Select'
import { IFilterForm } from 'features/depositTimeReport/type'

interface IDepositTimeReportFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	statusEnumList: IEnumTypeData[]
	timeZoneUtcOffset: number
	currencyListBySite: Currency[]
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

const DepositTimeReportFilter = ({
	form,
	loading,
	statusEnumList,
	timeZoneUtcOffset,
	currencyListBySite,
	onSearch,
	onTimeZoneChange,
}: IDepositTimeReportFilterProps) => {
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

	const depositTimeStatusSelector = () => {
		const handleChangeStatus = (newStatuses: number[]) => {
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
					onChange={handleChangeStatus}
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
						form={form}
						layout='vertical'
						size='middle'
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
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{depositTimeStatusSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='memberId' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='depositId' label={t('Label_DepositId')}>
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

export { DepositTimeReportFilter }
