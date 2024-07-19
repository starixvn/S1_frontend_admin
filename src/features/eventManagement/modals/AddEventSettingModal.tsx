import { useTranslation } from 'react-i18next'
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
import { InputNumber } from 'components'
import dayjs from 'dayjs'
import { PermissionInterface } from 'type'
import { dateFormat } from '../../../common/utils/format'
import type { IAddForm } from '../type'
import { RANGE_PICKER_RANGES, DATE_RANGES } from '../../../app/constants/ranges'

const { RangePicker } = DatePicker
const { Title } = Typography

interface IAddEventSettingModalProps {
	visible: boolean
	form: FormInstance<IAddForm>
	editPermission?: PermissionInterface
	loading: boolean
	onCancel: () => void
	onAdd: () => void
}

const AddEventSettingModal = ({
	visible,
	form,
	editPermission,
	loading,
	onCancel,
	onAdd,
}: IAddEventSettingModalProps) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()

	/**  ======= 常數 ======= */

	const todayRange = DATE_RANGES.Today as [dayjs.Dayjs, dayjs.Dayjs]

	/**  ======= 函數 ======= */

	/** 禁用當前日期之前的日期 */
	const disabledDate = (current: dayjs.Dayjs) =>
		current && current.isBefore(dayjs().startOf('day'))

	/** 禁用活動結束日期之前的日期 */
	const disabledDrawPrizeDate = (current: dayjs.Dayjs) => {
		const endDate = form.getFieldValue('dateRange')?.[1]
		const endDatePlusOne = endDate.add(1, 'day')
		return (
			current &&
			(current.isBefore(endDatePlusOne, 'day') ||
				current.isBefore(dayjs().startOf('day')))
		)
	}
	/** 將 boolean 轉換為 1 (true) 或 0 (false) */
	const mapToCheckBoxValue = (isChecked: boolean | number) =>
		isChecked ? 1 : 0

	/** 有值傳值，如果是 undefined 轉換為 0 */
	const mapToInputValue = (inputValue: undefined | number) => inputValue ?? 0

	return (
		<Modal
			width='60%'
			open={visible}
			title={<div style={{ textAlign: 'center' }}>{t('Label_Add')}</div>}
			onCancel={onCancel}
			destroyOnClose
			footer={false}
		>
			<Spin spinning={loading}>
				<Form
					form={form}
					layout='vertical'
					onFinish={({
						firstPrize,
						secondPrize,
						thirdPrize,
						consolation,
						small,
					}) => {
						// 後端的資料格式，非 true 跟 false，而是 1(勾選) 跟 0（未勾選）
						form.setFieldsValue({
							firstPrize: mapToCheckBoxValue(firstPrize),
							secondPrize: mapToCheckBoxValue(secondPrize),
							thirdPrize: mapToCheckBoxValue(thirdPrize),

							// input 值為 undefined (未填寫)，要轉換成 0
							consolation: mapToInputValue(consolation),
							small: mapToInputValue(small),
						})
						onAdd()
						onCancel()
					}}
				>
					{/* === Period RangePicker ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item label={t('Label_ReportDate')}>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='dateRange'
										// 活動初始日期預設為今天
										initialValue={todayRange}
										rules={[
											{
												required: true,
												message: t('Label_DateRangeRequire'),
											},
										]}
									>
										<RangePicker
											style={{ width: '100%' }}
											ranges={RANGE_PICKER_RANGES(['Today'])}
											format={dateFormat}
											disabledDate={disabledDate}
										/>
									</Form.Item>
								</Input.Group>
							</Form.Item>
						</Col>
					</Row>

					{/* === DrawPrize ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item
								label={
									<Space size='middle'>
										<Typography.Text>{t('Label_DrawPrize')}</Typography.Text>
									</Space>
								}
							>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='drawDate'
										// 開獎日期預設明天，不跟初始的活動日期重複
										initialValue={todayRange[1].add(1, 'day')}
										rules={[
											{
												required: true,
												message: t('Label_DateRangeRequire'),
											},
											{
												// 開獎日期要在活動結束之後
												validator: (_, value) => {
													const endDate = form.getFieldValue('dateRange')?.[1]
													const isBeforeReportEndDate = value.isBefore(
														endDate,
														'day'
													)
													if (isBeforeReportEndDate) {
														return Promise.reject(
															new Error(t('Label_DrawDateBeforeEndDate'))
														)
													}
													return Promise.resolve()
												},
											},
										]}
									>
										<DatePicker
											style={{ width: '100%' }}
											format={dateFormat}
											disabledDate={disabledDrawPrizeDate}
										/>
									</Form.Item>
								</Input.Group>
							</Form.Item>
						</Col>
					</Row>

					{/* === Prize Title ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Title level={5}>{t('Label_Exclude_Setting')}</Title>
						</Col>
						<Col lg={14} md={12} xs={12}>
							<Typography.Text>{t('Label_Prize')}</Typography.Text>
						</Col>
					</Row>

					{/* === Prize Checkbox ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col
							lg={14}
							md={12}
							xs={12}
							style={{ display: 'flex', justifyContent: 'space-between' }}
						>
							<Form.Item
								name='firstPrize'
								valuePropName='checked'
								initialValue={false}
							>
								<Checkbox>{t('Label_First')}</Checkbox>
							</Form.Item>
							<Form.Item
								name='secondPrize'
								valuePropName='checked'
								initialValue={false}
							>
								<Checkbox>{t('Label_Second')}</Checkbox>
							</Form.Item>
							<Form.Item
								name='thirdPrize'
								valuePropName='checked'
								initialValue={false}
							>
								<Checkbox>{t('Label_Third')}</Checkbox>
							</Form.Item>
						</Col>
					</Row>

					{/* === Consolation Input ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item name='consolation' label={t('Label_Consolation')}>
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>

					{/* === Small Input ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item name='small' label={t('Label_Small')}>
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>

					{/* === Consolation Button ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col
							lg={14}
							md={12}
							xs={12}
							style={{ display: 'flex', justifyContent: 'center' }}
						>
							<Button
								loading={loading}
								disabled={!editPermission?.canUse}
								htmlType='submit'
								type='primary'
							>
								{t('Label_Save')}
							</Button>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Modal>
	)
}

export { AddEventSettingModal }
