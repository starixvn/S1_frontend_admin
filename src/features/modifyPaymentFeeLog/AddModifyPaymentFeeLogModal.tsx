import {
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Select,
} from 'antd'
import { IGetPaySettingData } from 'common/service/allDataApi'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { InputNumber } from 'components'

interface IAddModifyPaymentFeeLogModalProps {
	loading: boolean
	form: FormInstance
	paySettingList: IGetPaySettingData[]
	visible: boolean
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onCancel: () => void
	onFinish: () => void
}

const { Option } = Select
const { RangePicker } = DatePicker

const AddModifyPaymentFeeLogModal = ({
	loading,
	form,
	paySettingList,
	visible,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onCancel,
	onFinish,
}: IAddModifyPaymentFeeLogModalProps) => {
	const { t } = useTranslation()
	const formPaymentGateway = Form.useWatch('paymentGateway', form)
	const formCurrency = Form.useWatch('currencyId', form)

	const paymentGatewaySelector = () => {
		const set = new Set()
		const filterPaySetting = paySettingList.filter(({ payId }) =>
			!set.has(payId) ? set.add(payId) : false
		)
		const onChangePaymentGateWay = (newPayId: number) => {
			form.resetFields(['currencyId', 'channelId'])
			form.setFieldsValue({
				paymentGateway: newPayId,
			})
		}

		return (
			<Form.Item
				name='paymentGateway'
				label={t('Label_PaymentGateway')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_PaymentGateway'),
						}),
					},
				]}
			>
				<Select
					onChange={onChangePaymentGateWay}
					placeholder={t('Label_Select')}
				>
					{filterPaySetting.map(({ payName, payId }) => (
						<Option key={payId} value={payId}>
							{payName}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	const currencySelector = () => {
		const set = new Set()
		const filterPaySettingList = paySettingList
			?.filter(({ payId }) => formPaymentGateway === payId)
			.filter(({ currencyId }) =>
				!set.has(currencyId) ? set.add(currencyId) : false
			)

		const onChangeCurrency = (newCurrencyId: number) => {
			form.resetFields(['channelId'])
			form.setFieldsValue({
				currencyId: newCurrencyId,
			})
		}

		return (
			<Form.Item
				name='currencyId'
				label={t('Label_Currency')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Currency'),
						}),
					},
				]}
			>
				<Select
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
					disabled={!formPaymentGateway}
				>
					{filterPaySettingList.map(({ currencyId, isoCode }) => (
						<Option key={currencyId} value={currencyId}>
							{isoCode}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	const channelSelector = () => {
		const set = new Set()
		const filterPaySetting = paySettingList
			?.filter(
				({ payId, currencyId }) =>
					formPaymentGateway === payId && formCurrency === currencyId
			)
			.filter(({ channelId }) =>
				!set.has(channelId) ? set.add(channelId) : false
			)

		const onChangeChannel = (newChannelId: number) => {
			form.setFieldsValue({
				channelId: newChannelId,
			})
		}

		return (
			<Form.Item
				name='channelId'
				label={t('Label_Channel')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Channel'),
						}),
					},
				]}
			>
				<Select
					onChange={onChangeChannel}
					placeholder={t('Label_Select')}
					disabled={!formPaymentGateway || !formCurrency}
				>
					{filterPaySetting.map(({ channelName, channelId }) => (
						<Option key={channelId} value={channelId}>
							{channelName}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	return (
		<Modal
			open={visible}
			title={t('Label_AddNewWork')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			afterClose={() => form.resetFields()}
			onOk={onFinish}
		>
			<Form form={form} layout='vertical'>
				<Row align='middle' gutter={16}>
					<Col lg={12} md={24} xs={24}>
						{paymentGatewaySelector()}
					</Col>
					<Col lg={12} md={24} xs={24}>
						{currencySelector()}
					</Col>
				</Row>
				<Row align='middle' gutter={16}>
					<Col lg={12} md={24} xs={24}>
						{channelSelector()}
					</Col>
				</Row>
				<Row align='middle' gutter={16}>
					<Col lg={12} md={24} xs={24}>
						<Form.Item
							name='chargeFeePercentage'
							label={t('Label_ChargeFee')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_ChargeFee'),
									}),
								},
							]}
						>
							<InputNumber
								controls={false}
								type='number'
								style={{ width: '100%' }}
								placeholder={t('Label_ChargeFee')}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={24} xs={24}>
						<Form.Item
							name='chargeFeePreCount'
							label={t('Label_PerCount')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_PerCount'),
									}),
								},
							]}
						>
							<InputNumber
								controls={false}
								type='number'
								style={{ width: '100%' }}
								placeholder={t('Label_PerCount')}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' gutter={16}>
					<Col lg={24} md={24} xs={24}>
						<Form.Item label={t('Label_DateRange')}>
							<Input.Group compact style={{ width: '100%', display: 'flex' }}>
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
										ranges={MOMENT_RANGE_PICKER_RANGES([
											'Today',
											'Last 7 Day',
											'This Month',
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
		</Modal>
	)
}

export default AddModifyPaymentFeeLogModal
