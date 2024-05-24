import { FC } from 'react'
import {
	Col,
	Collapse,
	Form,
	FormInstance,
	Input,
	Row,
	DatePicker,
	Button,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { validateIPAddress } from 'common/utils'
import { IForm } from 'features/blockIp/type'

const { Panel } = Collapse
const { RangePicker } = DatePicker

interface IBlockIpFilterProps {
	loading: boolean
	form: FormInstance<IForm>
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

const BlockIpFilter: FC<IBlockIpFilterProps> = ({
	loading,
	form,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
}) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{ ip: '' }}
					>
						<Row align='middle' gutter={16}>
							<Col lg={10} md={24} xs={24}>
								<Form.Item label={t('Label_DateRange')}>
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
												showTime
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

							<Col lg={6} md={24} xs={24}>
								<Form.Item
									name='ip'
									label={t('Label_Ip')}
									rules={[
										{
											whitespace: true,
											validator: (_validator, value) => {
												return !value || validateIPAddress(value)
													? Promise.resolve()
													: Promise.reject(
															new Error(t('Label_InputCurrentIpAddress'))
													  )
											},
										},
									]}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>

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

export default BlockIpFilter
