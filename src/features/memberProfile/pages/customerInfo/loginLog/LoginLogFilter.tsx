import { Button, Col, DatePicker, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'

interface ILoginLogFilterProps {
	loading: boolean
	form: FormInstance
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
	timeZoneUtcOffset: number
}

const { RangePicker } = DatePicker

const LoginLogFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
}: ILoginLogFilterProps) => {
	const { t } = useTranslation()
	return (
		<Form
			layout='vertical'
			size='middle'
			form={form}
			onFinish={() => onSearch({})}
		>
			<Row align='middle' gutter={20}>
				<Col span={10}>
					<Form.Item label={t('Label_DateRange')}>
						<Input.Group compact style={{ width: '100%', display: 'flex' }}>
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
				<Col span={3}>
					<Form.Item label={' '}>
						<Button
							loading={loading}
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
	)
}

export { LoginLogFilter }
