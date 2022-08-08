import { FC, useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import {
	Col,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
	IGetBankListData,
	IGetPaymentTypeData,
	LocalAccountNoSelectValue,
} from 'features/withdrawalSubmission/type'
import {
	PaymentEnum,
	UsedCardEnum,
	usedCardList,
} from 'features/withdrawalSubmission/constants'
import {
	ChannelType,
	IChannelValue,
} from 'features/withdrawalSubmission/converter'
import { numberFormatter } from 'common/utils/format'
import { find } from 'lodash'

interface IWithdrawalSubmissionFormProps {
	loading: boolean
	form: FormInstance
	paymentTypeList: IGetPaymentTypeData[]
	custBankList: IGetBankListData
	channelList: ChannelType
}

const { Option } = Select

const WithdrawalSubmissionForm: FC<IWithdrawalSubmissionFormProps> = ({
	loading,
	form,
	paymentTypeList,
	custBankList,
	channelList,
}) => {
	const { t } = useTranslation()
	const usedCard = Form.useWatch('isExistBankCard', form)
	const payment = Form.useWatch('paymentId', form)
	const currentCryptoChannel = Form.useWatch('channel', form)

	const {
		eligibleWithdrawal,
		accountName: accountHolderName,
		existLocalBankList,
		existCryptoList,
		localBankSysList,
	} = custBankList ?? {}

	const handleResetInfo = () => {
		form.resetFields(['accountNo', 'bankName', 'channel'])
	}

	// 若payment 為crypto 時 , 選擇 channel 自動帶入 bankName
	const handleChangeChannel = (value: string) => {
		const { displayName } = JSON.parse(value)
		form.resetFields(['accountNo'])
		form.setFieldsValue({
			bankName: displayName,
		})
	}

	const accountNoRenderer = () => {
		const handleLocalAccountNoChange = (value: string) => {
			if (!value) return
			const { sysId } = JSON.parse(value) as LocalAccountNoSelectValue
			const bankName = find(
				localBankSysList,
				bank => bank.value === sysId
			)?.content
			form.setFieldsValue({
				bankName,
			})
		}

		if (
			usedCard === UsedCardEnum.MemberCard &&
			payment === PaymentEnum.LocalBank
		) {
			return (
				<Select
					placeholder={t('Label_Select')}
					onChange={handleLocalAccountNoChange}
					dropdownMatchSelectWidth={false}
				>
					{existLocalBankList?.map(bank => {
						const { accountNo, sysId } = bank
						const value = JSON.stringify({ accountNo, sysId })
						return (
							<Option key={accountNo} value={value}>
								{accountNo}
							</Option>
						)
					})}
				</Select>
			)
		}
		if (
			usedCard === UsedCardEnum.MemberCard &&
			payment === PaymentEnum.Crypto
		) {
			const currentChannel = currentCryptoChannel
				? (JSON.parse(currentCryptoChannel) as IChannelValue)
				: undefined
			const displayList = existCryptoList?.filter(
				existCrypto =>
					existCrypto.currencyId === currentChannel?.cryptoCurrencyId &&
					existCrypto.network === currentChannel?.cryptoNetwork
			)

			return (
				<Select
					placeholder={t('Label_Select')}
					// 不限制下拉選單寬度 , 因為address太長 , 下拉選單需要看到全部
					dropdownMatchSelectWidth={false}
				>
					{displayList?.map(account => {
						const { network, currencyName, usdtAddress } = account
						const value = JSON.stringify({ network, currencyName, usdtAddress })
						return (
							<Option key={usdtAddress} value={value}>
								{usdtAddress}
							</Option>
						)
					})}
				</Select>
			)
		}
		return <Input />
	}

	useEffect(() => {
		if (!loading) {
			form.setFieldsValue({
				eligibleWithdrawal: eligibleWithdrawal
					? numberFormatter.format(eligibleWithdrawal)
					: '',
				accountHolderName,
			})
		}
	}, [loading])

	return (
		<Spin spinning={loading}>
			<LayoutContent.Card style={{ marginTop: '20px', paddingTop: '25px' }}>
				<Form
					layout='vertical'
					size='middle'
					form={form}
					initialValues={{
						isExistBankCard: UsedCardEnum.MemberCard,
						paymentId: PaymentEnum.LocalBank,
						memo: '',
					}}
				>
					<Row gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='paymentId'
								label={t('Label_Payment')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Payment'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select')}
									onChange={handleResetInfo}
								>
									{/*  前端不顯示undefined  */}
									{paymentTypeList
										?.filter(
											filterType => filterType.value !== PaymentEnum.Undefined
										)
										.map(type => (
											<Option key={type.value} value={type.value}>
												{type.name}
											</Option>
										))}
								</Select>
							</Form.Item>
						</Col>
						{payment === PaymentEnum.Crypto && (
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='channel' label={t('Label_Channel')}>
									<Select
										placeholder={t('Label_Select')}
										onChange={handleChangeChannel}
									>
										{channelList?.map(channel => {
											const { displayName, value: rawValue } = channel
											// 因為要儲存 Obj 故先轉成字串
											const value = JSON.stringify({ ...rawValue, displayName })
											return (
												<Option key={displayName} value={value}>
													{displayName}
												</Option>
											)
										})}
									</Select>
								</Form.Item>
							</Col>
						)}
					</Row>
					<Row gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='isExistBankCard' label={t('Label_UsedCard')}>
								<Select
									placeholder={t('Label_Select')}
									onChange={handleResetInfo}
								>
									{usedCardList?.map(card => (
										<Option key={card.value} value={card.value}>
											{t(card.displayKey)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='accountNo'
								label={t('Label_AccountNo')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AccountNo'),
										}),
									},
								]}
							>
								{accountNoRenderer()}
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='bankName'
								label={t('Label_BankName')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_BankName'),
										}),
									},
								]}
							>
								{usedCard === UsedCardEnum.ManualCard &&
								payment === PaymentEnum.LocalBank ? (
									<Select placeholder={t('Label_Select')}>
										{localBankSysList?.map(bank => (
											<Option key={bank.value} value={bank.value}>
												{bank.content}
											</Option>
										))}
									</Select>
								) : (
									<Input disabled />
								)}
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='accountHolderName'
								label={t('Label_AccountHolderName')}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='eligibleWithdrawal'
								label={t('Label_EligibleWithdrawal')}
							>
								<InputNumber style={{ width: '100%' }} disabled />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='amount'
								label={t('Label_Amount')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Amount'),
										}),
									},
								]}
							>
								<InputNumber style={{ width: '100%' }} type='number' />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='memo'
								label={t('Label_Memo')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Memo'),
										}),
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</LayoutContent.Card>
		</Spin>
	)
}

export { WithdrawalSubmissionForm }
