import {
	Col,
	Row,
	Form,
	Input,
	Button,
	Collapse,
	DatePicker,
	FormInstance,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import { DATE_RANGES, RANGE_PICKER_PRESETS } from 'app/constants/ranges'
import { dateFormat } from 'common/utils/format'
import { IFilterForm } from 'features/newsManagement/type'

interface IEventManagementFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	editPermission?: PermissionInterface
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void

	onSetRaffleTicketAndSticker: () => void
	onOpenMaintain: () => void
}

const { Panel } = Collapse
const { RangePicker } = DatePicker

const EventManagementFilter = ({
	form,
	loading,
	editPermission,
	onSearch,
	onSetRaffleTicketAndSticker,
	onOpenMaintain,
}: IEventManagementFilterProps) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={12} xs={12}>
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
												presets={RANGE_PICKER_PRESETS([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
												])}
												format={dateFormat}
											/>
										</Form.Item>
									</Input.Group>
								</Form.Item>
							</Col>
						</Row>

						<Row justify='end' align='middle' gutter={16}>
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

							<Col>
								<Button type='primary' onClick={onSetRaffleTicketAndSticker}>
									{t('Label_Raffle_Ticket_And_Sticker')}
								</Button>
							</Col>

							<Col>
								<Button
									type='primary'
									disabled={!editPermission?.canUse}
									onClick={onOpenMaintain}
								>
									{t('Label_Maintenance')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { EventManagementFilter }
