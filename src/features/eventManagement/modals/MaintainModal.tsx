import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import {
	Checkbox,
	Col,
	Space,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Spin,
	Typography,
	Button,
} from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import { dateFormat } from '../../../common/utils/format'
import {
	DATE_RANGES,
	RANGE_PICKER_PRESETS,
} from '../../../app/constants/ranges'

const { RangePicker } = DatePicker

interface IGlobalStatusModalProps {
	visible: boolean
	form: FormInstance
	onCancel: () => void
	onSetMaintain: () => void
}

const MaintainModal = ({
	visible,
	form,
	onCancel,
	onSetMaintain,
}: IGlobalStatusModalProps) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()

	/**  ======= 函數 ======= */

	/** 禁用當前時間之前的日期與時間 */
	const disabledDate: RangePickerProps['disabledDate'] = (
		current: dayjs.Dayjs
	) => current && current.isBefore(dayjs().startOf('day'))

	return (
		<Modal
			width='40%'
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_Maintenance')}</div>
			}
			onCancel={onCancel}
			destroyOnClose
			footer={false}
		>
			<Spin spinning={false}>
				<Form
					form={form}
					layout='vertical'
					onFinish={() => {
						onSetMaintain()
						onCancel()
					}}
				>
					{/* === Period RangePicker ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item
								style={{ marginBottom: 10 }}
								label={
									<Space size='middle'>
										<Form.Item
											name='isMaintain'
											valuePropName='checked'
											initialValue={false}
											noStyle
										>
											<Checkbox>{t('Label_UnderMaintenance')}</Checkbox>
										</Form.Item>
									</Space>
								}
							>
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
											presets={RANGE_PICKER_PRESETS(['Today'])}
											format={dateFormat}
											disabledDate={disabledDate}
										/>
									</Form.Item>
								</Input.Group>
							</Form.Item>
							<Typography.Text type='secondary'>
								{t('Label_SiteMaintenanceMessage')}
							</Typography.Text>
						</Col>
					</Row>

					{/* === Consolation Button ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col
							lg={14}
							md={12}
							xs={12}
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: 10,
							}}
						>
							<Button htmlType='submit' type='primary'>
								{t('Label_Save')}
							</Button>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Modal>
	)
}

export { MaintainModal }
