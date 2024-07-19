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
import type { IEditForm } from '../type'
import { RANGE_PICKER_RANGES } from '../../../app/constants/ranges'
import { LotteryStatusEnum } from '../contants'

const { RangePicker } = DatePicker
const { Title } = Typography

interface IEditEventSettingModalProps {
	visible: boolean
	form: FormInstance<IEditForm>
	editPermission?: PermissionInterface
	loading: boolean
	onCancel: () => void
	onRowSaved: () => void
}

const EditEventSettingModal = ({
	visible,
	form,
	editPermission,
	loading,
	onCancel,
	onRowSaved,
}: IEditEventSettingModalProps) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()

	/**  ======= useEffect ======= */

	// 隨著使用者點擊不同筆資料的編輯，初始化時設定此資料的編輯彈窗日期選擇器的範圍（跟表單顯示的日期範圍一樣）
	useEffect(() => {
		if (visible) {
			const { status, startDateISOStr, endDateISOStr, drawDateISOStr } =
				form.getFieldsValue(true)

			/** 當前活動如果是暫停，Suspended checkbox 預設勾選 ; 反之亦然 */
			const isSuspend = status === LotteryStatusEnum.Suspended

			// 將 ISO 字串轉為 dayjs 物件，存進 form 內，供日期選擇器使用
			form.setFieldsValue({
				isSuspend,
				dateRange: [dayjs(startDateISOStr), dayjs(endDateISOStr)],
				drawDate: dayjs(drawDateISOStr),
			})
		}
	}, [visible, form])

	/**  ======= 常數 ======= */

	/** 是否暫停此次活動 */
	const isSuspended = Form.useWatch('isSuspend', form)

	const status = form.getFieldValue('status')

	/** 只要活動不是 Running 狀態，就禁用除了 suspend checkbox & form submit btn 以外的選項 */
	const disabled = status !== LotteryStatusEnum.Running

	/** 活動已結束，禁用 suspend checkbox & form submit btn */
	const lotteryOver =
		status === LotteryStatusEnum.Done || status === LotteryStatusEnum.Payout

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
			title={<div style={{ textAlign: 'center' }}>{t('Label_Edit')}</div>}
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
						onRowSaved()
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
											disabled={disabled}
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
										<Form.Item name='isSuspend' valuePropName='checked' noStyle>
											<Checkbox disabled={lotteryOver}>
												{t('Label_Suspended')}
											</Checkbox>
										</Form.Item>
									</Space>
								}
							>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='drawDate'
										rules={[
											{
												required: Boolean(!isSuspended),
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
											disabled={Boolean(isSuspended) || disabled}
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
								<Checkbox disabled={disabled}>{t('Label_First')}</Checkbox>
							</Form.Item>
							<Form.Item
								name='secondPrize'
								valuePropName='checked'
								initialValue={false}
							>
								<Checkbox disabled={disabled}>{t('Label_Second')}</Checkbox>
							</Form.Item>
							<Form.Item
								name='thirdPrize'
								valuePropName='checked'
								initialValue={false}
							>
								<Checkbox disabled={disabled}>{t('Label_Third')}</Checkbox>
							</Form.Item>
						</Col>
					</Row>

					{/* === Consolation Input ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item name='consolation' label={t('Label_Consolation')}>
								<InputNumber disabled={disabled} />
							</Form.Item>
						</Col>
					</Row>

					{/* === Small Input ===  */}
					<Row align='middle' justify='center' gutter={16}>
						<Col lg={14} md={12} xs={12}>
							<Form.Item name='small' label={t('Label_Small')}>
								<InputNumber disabled={disabled} />
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
								disabled={!editPermission?.canUse || lotteryOver}
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

export { EditEventSettingModal }
