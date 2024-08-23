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
import { useEffect } from 'react'
import { dateFormat } from '../../../common/utils/format'
import type { IEditOrAddForm } from '../type'
import {
	RANGE_PICKER_PRESETS,
	DATE_RANGES,
} from '../../../app/constants/ranges'
import { LotteryStatusEnum } from '../contants'

const { RangePicker } = DatePicker
const { Title } = Typography

interface IEditOrAddEventSettingModalProps {
	visible: boolean
	form: FormInstance<IEditOrAddForm>
	loading: boolean
	isAddModal: boolean
	editPermission?: PermissionInterface
	onAdd: () => void
	onCancel: () => void
	onRowSaved: () => void
}

const EditOrAddEventSettingModal = ({
	visible,
	form,
	loading,
	isAddModal,
	editPermission,
	onAdd,
	onCancel,
	onRowSaved,
}: IEditOrAddEventSettingModalProps) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()

	/**  ======= useEffect ======= */

	useEffect(() => {
		if (!visible) return

		const todayRange = DATE_RANGES.Today as [dayjs.Dayjs, dayjs.Dayjs]

		// 如果是編輯彈窗，隨著使用者點擊不同筆資料的編輯，初始化時設定此資料的編輯彈窗日期選擇器的範圍（跟表單顯示的日期範圍一樣）
		if (!isAddModal) {
			const { status, startDateISOStr, endDateISOStr, drawDateISOStr } =
				form.getFieldsValue(true)

			/** 當前活動如果是暫停，Suspended checkbox 預設勾選 ; 反之亦然 */
			const isSuspend = status === LotteryStatusEnum.Suspended

			// 將 ISO 字串轉為 dayjs 物件，存進 form 內，供日期選擇器使用09
			form.setFieldsValue({
				isSuspend,
				dateRange: [dayjs(startDateISOStr), dayjs(endDateISOStr)],
				drawDate: dayjs(drawDateISOStr),
			})
			return
		}

		// 如果是新增彈窗，就將當天的日期提供給 Report 日期選擇器使用，Draw 日期選擇器要再加一天（不能跟開獎日同天）
		form.setFieldsValue({
			isSuspend: false,
			dateRange: todayRange,
			drawDate: todayRange[1].add(1, 'day'),
		})
	}, [visible, form])

	/**  ======= 常數 ======= */

	/** 權限不足 */
	const noPermission = !editPermission?.canUse

	/** 活動是否進行中 */
	const isRunning = form.getFieldValue('status') === LotteryStatusEnum.Running

	/** 活動結束 */
	const isCompleted =
		form.getFieldValue('status') === LotteryStatusEnum.Done ||
		form.getFieldValue('status') === LotteryStatusEnum.Payout

	/** 是否暫停活動 */
	const isSuspended = Form.useWatch('isSuspend', form)

	/** 活動暫停或活動結束，則禁用 DrawDate 日期選擇器 */
	const shouldDisableDrawDate = Boolean(isSuspended) || isCompleted

	/** 編輯模式下，如果權限不足或活動未進行，則禁用此表單 */
	const shouldDisableForm = (!isAddModal && !isRunning) || noPermission

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
			width='40%'
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>
					{t(`${isAddModal ? 'Label_Add' : 'Label_Edit'}`)}
				</div>
			}
			onCancel={onCancel}
			destroyOnClose
			footer={false}
		>
			<Spin spinning={loading}>
				<Form
					form={form}
					layout='vertical'
					onFinish={({
						isSuspend,
						firstPrize,
						secondPrize,
						thirdPrize,
						consolation,
						small,
					}) => {
						// 後端的資料格式，非 true 跟 false，而是 1(勾選) 跟 0（未勾選）
						form.setFieldsValue({
							isSuspend: mapToCheckBoxValue(isSuspend),
							firstPrize: mapToCheckBoxValue(firstPrize),
							secondPrize: mapToCheckBoxValue(secondPrize),
							thirdPrize: mapToCheckBoxValue(thirdPrize),

							// input 值為 undefined (未填寫)，要轉換成 0
							consolation: mapToInputValue(consolation),
							small: mapToInputValue(small),
						})

						if (isAddModal) {
							onAdd()
						} else {
							onRowSaved()
						}

						onCancel()
					}}
				>
					{/* === Period RangePicker ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item label={t('Label_ReportDate')}>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item noStyle name='dateRange'>
										<RangePicker
											style={{ width: '100%' }}
											presets={RANGE_PICKER_PRESETS(['Today'])}
											format={dateFormat}
											disabledDate={disabledDate}
											disabled={shouldDisableForm}
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
										{!isAddModal && (
											<Form.Item
												name='isSuspend'
												valuePropName='checked'
												noStyle
											>
												<Checkbox disabled={isCompleted || noPermission}>
													{t('Label_Suspended')}
												</Checkbox>
											</Form.Item>
										)}
									</Space>
								}
							>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='drawDate'
										rules={[
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
											// 編輯模式下，使用者勾選停止活動或是非進行中活動，就禁用開獎日期選擇
											disabled={shouldDisableDrawDate || noPermission}
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
								<Checkbox disabled={shouldDisableForm}>
									{t('Label_First')}
								</Checkbox>
							</Form.Item>
							<Form.Item
								name='secondPrize'
								valuePropName='checked'
								initialValue={false}
							>
								<Checkbox disabled={shouldDisableForm}>
									{t('Label_Second')}
								</Checkbox>
							</Form.Item>
							<Form.Item
								name='thirdPrize'
								valuePropName='checked'
								initialValue={false}
							>
								<Checkbox disabled={shouldDisableForm}>
									{t('Label_Third')}
								</Checkbox>
							</Form.Item>
						</Col>
					</Row>

					{/* === Consolation Input ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item name='consolation' label={t('Label_Consolation')}>
								<InputNumber disabled={shouldDisableForm} />
							</Form.Item>
						</Col>
					</Row>

					{/* === Small Input ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item name='small' label={t('Label_Small')}>
								<InputNumber disabled={shouldDisableForm} />
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
								disabled={isCompleted || noPermission}
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

export { EditOrAddEventSettingModal }
