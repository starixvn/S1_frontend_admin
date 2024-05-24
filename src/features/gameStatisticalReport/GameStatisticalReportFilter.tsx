import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { Col, Collapse, DatePicker, Form, FormInstance, Input, Row } from 'antd'
import { IForm } from './type'

interface GameStatisticalReportFilterInterface {
	form: FormInstance<IForm>
	timeZoneUtcOffset?: number
	onTimeZoneChange: (newUtcOffset: number) => void
}

const GameStatisticalReportFilter = ({
	form,
	timeZoneUtcOffset,
	onTimeZoneChange,
}: GameStatisticalReportFilterInterface) => {
	const { t } = useTranslation()
	const { RangePicker } = DatePicker
	const { Panel } = Collapse

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form layout='vertical' size='middle' form={form}>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
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
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default GameStatisticalReportFilter
