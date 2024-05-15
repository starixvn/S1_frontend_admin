import { Button, Col, DatePicker, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'

interface IRewardPointLogFilterProps {
	loading: boolean
	form: FormInstance
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
	timeZoneUtcOffset: number
}

const { RangePicker } = DatePicker

const RewardPointLogFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
}: IRewardPointLogFilterProps) => {
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
								initialValue={DATE_RANGES['Last 7 Day']}
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

export { RewardPointLogFilter }
