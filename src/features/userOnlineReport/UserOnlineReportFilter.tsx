import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
} from 'antd'
import dayjs from 'dayjs'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { IFilterForm } from 'features/userOnlineReport/type'

const { Panel } = Collapse

interface IUserOnlineReportFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: ({ currentTimeZone }: { currentTimeZone?: number }) => void
}

const UserOnlineReportFilter = ({
	form,
	loading,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: IUserOnlineReportFilterProps) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						initialValues={{
							date: dayjs().startOf('day'),
						}}
						onFinish={() => onSearch({})}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_Date')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										<Form.Item
											noStyle
											name='date'
											rules={[
												{
													required: true,
													message: t('Label_Date'),
												},
											]}
										>
											<DatePicker style={{ width: '100%' }} />
										</Form.Item>
										<Form.Item name='timezone' style={{ margin: 0 }}>
											<div>
												<TimeZoneSelect
													value={timeZoneUtcOffset}
													onChange={onTimeZoneChange}
												/>
											</div>
										</Form.Item>
									</Input.Group>
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

export default UserOnlineReportFilter
