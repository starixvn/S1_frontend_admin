import { first } from 'lodash'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
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
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import { IFilterForm } from 'features/announcement/type'
import { STATUS_OPTIONS } from 'features/announcement/constants'

interface AnnouncementFilterProps {
	filterLoading: boolean
	form: FormInstance<IFilterForm>
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

const AnnouncementFilter = ({
	filterLoading,
	form,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: AnnouncementFilterProps) => {
	const { t } = useTranslation()
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
							status: first(STATUS_OPTIONS)?.value,
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
							<Col lg={6} md={12} xs={24}>
								<Form.Item
									name='status'
									label={t('Label_Status')}
									style={{ margin: 0, width: 200 }}
								>
									<Select placeholder={t('Label_SelectStatus')}>
										{STATUS_OPTIONS.map(({ value, label }) => (
											<Option key={value} value={value}>
												{label}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<br />

						<Row justify='end' align='middle'>
							<Col>
								<Button
									loading={filterLoading}
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

export default AnnouncementFilter
