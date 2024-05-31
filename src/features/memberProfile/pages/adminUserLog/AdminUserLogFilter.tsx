import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { Col, Row, Form, Input, Button, DatePicker, FormInstance } from 'antd'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { dateFormat } from 'common/utils/format'
import { IFilterForm } from 'features/memberProfile/pages/adminUserLog/type'

interface IAdminUserLogFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	timeZoneUtcOffset: number
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

const { RangePicker } = DatePicker

const AdminUserLogFilter = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
}: IAdminUserLogFilterProps) => {
	const { t } = useTranslation()

	return (
		<Form
			layout='vertical'
			size='middle'
			form={form}
			onFinish={() => onSearch({})}
		>
			<Row align='middle' gutter={16}>
				<Col lg={14} md={24} xs={24}>
					<Form.Item label={t('Label_DateRange')}>
						<Input.Group compact style={{ width: '100%', display: 'flex' }}>
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
				<Button
					style={{ marginTop: 5 }}
					loading={loading}
					icon={<SearchOutlined />}
					htmlType='submit'
					type='primary'
				>
					{t('Label_Search')}
				</Button>
			</Row>
		</Form>
	)
}

export { AdminUserLogFilter }
