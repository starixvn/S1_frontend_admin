import { Button, Col, DatePicker, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import moment from 'moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { LeftOutlined, SearchOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction } from 'react'
import { GameStatementTableEnum } from 'features/memberProfile/constants'

interface IStatementFilterProps {
	loading: boolean
	form: FormInstance
	onSearch: () => void
	onTimeZoneChange: (newUtcOffset: number) => void
	timeZoneUtcOffset: number
	tableState: number
	setTableState: Dispatch<SetStateAction<number>>
}

const { RangePicker } = DatePicker

const StatementFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
	tableState,
	setTableState,
}: IStatementFilterProps) => {
	const { t } = useTranslation()
	return (
		<Form
			layout='vertical'
			size='middle'
			form={form}
			onFinish={() => onSearch()}
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
									onChange={newDateRange =>
										form.setFieldsValue({
											startDate: moment(newDateRange?.[0]),
											endDate: moment(newDateRange?.[1]),
										})
									}
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
				{tableState !== GameStatementTableEnum.TPBetRecord && (
					<Col style={{ marginLeft: 'auto' }}>
						<Button
							icon={<LeftOutlined />}
							onClick={() => {
								setTableState(prev => prev - 1)
							}}
						>
							{t('Label_Back')}
						</Button>
					</Col>
				)}
			</Row>
		</Form>
	)
}

export { StatementFilter }
