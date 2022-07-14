import { FC } from 'react'
import {
	Checkbox,
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Spin,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'

import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import moment from 'moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { timeFormat } from 'common/utils/format'

interface ISiteMaintenanceForm {
	form: FormInstance
	editPermission?: PermissionInterface
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	loading: boolean
}
const { RangePicker } = DatePicker
const SiteMaintenanceForm: FC<ISiteMaintenanceForm> = ({
	form,
	editPermission,
	timeZoneUtcOffset,
	onTimeZoneChange,
	loading,
}) => {
	const { t } = useTranslation()
	return (
		<LayoutContent.Card style={{ paddingTop: '10px' }}>
			<Spin spinning={loading}>
				<Form
					form={form}
					layout='vertical'
					size='middle'
					disabled={!editPermission?.canUse}
				>
					<Row align='top' gutter={16}>
						<Col lg={24} md={24} xs={24}>
							<Form.Item name='maintain' valuePropName='checked' noStyle>
								<Checkbox style={{ marginBottom: '10px' }}>
									{t('Label_UnderMaintenance')}
								</Checkbox>
							</Form.Item>
						</Col>
						<Col lg={12} md={24} xs={24}>
							<Input.Group
								compact
								style={{ width: '100%', display: 'flex', marginBottom: '5px' }}
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
											'Last 7 Day',
											'This Month',
										])}
										format={time =>
											time.utcOffset(timeZoneUtcOffset).format(timeFormat)
										}
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
							<Typography.Text type='secondary'>
								{t('Label_SiteMaintenanceMessage')}
							</Typography.Text>
						</Col>
					</Row>
				</Form>
			</Spin>
		</LayoutContent.Card>
	)
}

export { SiteMaintenanceForm }
