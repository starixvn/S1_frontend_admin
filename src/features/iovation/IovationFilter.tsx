import { first } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { selectCurrencyListBySite } from 'common/enum'
import { IEnumTypeData } from 'common/service/enumApi'
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
import { IFilterForm } from 'features/iovation/type'

interface IovationFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	timeZoneUtcOffset: number
	iovationDeviceTypeList: IEnumTypeData[]
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

const IovationFilter = ({
	form,
	loading,
	timeZoneUtcOffset,
	iovationDeviceTypeList,
	onTimeZoneChange,
	onSearch,
}: IovationFilterProps) => {
	const { t } = useTranslation()

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<LayoutContent.Card style={{ margin: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							currencyId: first(currencyListBySite)?.currencyId,
							userName: '',
							deviceId: '',
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
												showTime
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
								<Form.Item name='currencyId' label={t('Label_Currency')}>
									<Select placeholder='select'>
										{currencyListBySite?.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='deviceType' label={t('Label_DeviceType')}>
									<Select placeholder='select'>
										{iovationDeviceTypeList?.map(({ name, value }) => (
											<Option key={value} value={value}>
												{name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='deviceId' label={t('Label_DeviceId')}>
									<Input allowClear placeholder={t('Label_DeviceId')} />
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

export default IovationFilter
