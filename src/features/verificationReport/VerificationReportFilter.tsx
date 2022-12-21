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
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { Currency } from 'common/enum/type'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { IFilterForm } from 'features/verificationReport/type'

const { RangePicker } = DatePicker
const { Option } = Select
const { Panel } = Collapse

interface IVerificationReportFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	currencyListBySite: Currency[]
	isButtonAble: boolean
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

const VerificationReportFilter = ({
	form,
	loading,
	currencyListBySite,
	isButtonAble,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: IVerificationReportFilterProps) => {
	const { t } = useTranslation()

	const onChangeCurrency = (newCurrencyIds: Array<string | number>) => {
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
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<LayoutContent.Card>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={onSearch}
						initialValues={{
							currencyIds: currencyListBySite.map(
								({ currencyId }) => currencyId
							),
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={10} md={24} xs={24}>
								<Form.Item label={t('Label_PayoutTime')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										<Form.Item
											noStyle
											name='dateRange'
											initialValue={MOMENT_DATE_RANGES['Last 7 Day']}
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
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='currencyIds' label={t('Label_Currency')}>
									<MultipleSelect
										placeholder={t('Label_Select') + t('Label_Currency')}
										onChange={onChangeCurrency}
									>
										{currencyListBySite?.length > 1 && (
											<Option value='all'>{t('Label_SelectAll')}</Option>
										)}
										{currencyListBySite?.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='memberId' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='sabaId' label={t('Label_SabaId')}>
									<Input allowClear placeholder={t('Label_SabaId')} />
								</Form.Item>
							</Col>
						</Row>
						<Row justify='end' align='middle'>
							<Col>
								<Button
									disabled={!isButtonAble}
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

export default VerificationReportFilter
