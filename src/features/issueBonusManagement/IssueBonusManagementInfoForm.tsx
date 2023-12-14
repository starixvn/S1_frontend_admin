import { Col, Form, Input, Row } from 'antd'
import { InputNumber } from 'components/Input'
import { useTranslation } from 'react-i18next'
import { PromotionTypeEnum } from './constants'
import IssueBonusManagementDpTrxnDescription from './IssueBonusManagementDpTrxnDescription'
import { StyleButton } from './StyleButton'
import { ICheckBonusCodeData, ICheckTierRedepositBonusData } from './type'

interface IIssueBonusManagementInfoFormProps {
	loading: boolean
	bonusCodeInfo: ICheckBonusCodeData
	tierDepositBonusInfo: ICheckTierRedepositBonusData
	onClear: () => void
	onCheckPasswordModal: (newAmount: number, newRolloverAmount?: number) => void
	onCheckTierRedepositBonus: (depositId: string) => void
}

const IssueBonusManagementInfoForm = ({
	loading,
	bonusCodeInfo,
	tierDepositBonusInfo,
	onClear,
	onCheckPasswordModal,
	onCheckTierRedepositBonus,
}: IIssueBonusManagementInfoFormProps) => {
	const { t } = useTranslation()
	const [form] = Form.useForm<{
		amount: number
		rollOver: number
		depositId: string
	}>()

	const { bonus: initialAmount, rollOver, promotionType } = bonusCodeInfo

	const handleFinish = async () => {
		onCheckPasswordModal(
			tierDepositBonusInfo.bonusAmount,
			tierDepositBonusInfo.rolloverAmount
		)
	}

	const handleCheckTierRedepositBonus = async () => {
		const { depositId } = await form.validateFields()
		onCheckTierRedepositBonus(depositId)
	}

	return (
		<Form
			form={form}
			layout='vertical'
			size='middle'
			initialValues={{
				amount: initialAmount,
				rollOver,
				depositId: '',
			}}
			onFinish={handleFinish}
		>
			{promotionType === PromotionTypeEnum.ReDeposit ? (
				<>
					<Row align='middle' justify='space-between' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='depositId'
								label={t('Label_DPTrxnID')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_DPTrxnID'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>

						<Col lg={6} md={12} xs={12}>
							<Form.Item label=' '>
								<StyleButton
									onClick={handleCheckTierRedepositBonus}
									loading={loading}
									htmlType='button'
									type='primary'
								>
									{t('Label_CheckDpId')}
								</StyleButton>
							</Form.Item>
						</Col>
					</Row>

					{tierDepositBonusInfo && (
						<>
							<IssueBonusManagementDpTrxnDescription
								tierDepositBonusInfo={tierDepositBonusInfo}
							/>

							<br />

							<Row align='middle' justify='end' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item>
										<StyleButton
											onClick={onClear}
											htmlType='button'
											type='default'
										>
											{t('Label_Clear')}
										</StyleButton>
									</Form.Item>
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item>
										<StyleButton
											loading={loading}
											htmlType='submit'
											type='primary'
										>
											{t('Label_Submit')}
										</StyleButton>
									</Form.Item>
								</Col>
							</Row>
						</>
					)}
				</>
			) : (
				<Row align='middle' gutter={16}>
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
								{
									type: 'number',
									min: 0,
								},
							]}
						>
							<InputNumber
								type='number'
								controls={false}
								disabled={promotionType === PromotionTypeEnum.RetentionFreeBet}
							/>
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={12}>
						<Form.Item name='rollOver' label={t('Label_Rollover')}>
							<Input
								disabled={
									promotionType === PromotionTypeEnum.ManualBonus ||
									promotionType === PromotionTypeEnum.RetentionFreeBet
								}
							/>
						</Form.Item>
					</Col>

					<Col lg={6} md={12} xs={12}>
						<Form.Item label=' '>
							<StyleButton onClick={onClear} htmlType='button' type='default'>
								{t('Label_Clear')}
							</StyleButton>
						</Form.Item>
					</Col>

					<Col lg={6} md={12} xs={12}>
						<Form.Item label=' '>
							<StyleButton
								loading={loading}
								htmlType='submit'
								type='primary'
								disabled={!bonusCodeInfo?.hasBonusCode}
							>
								{t('Label_Submit')}
							</StyleButton>
						</Form.Item>
					</Col>
				</Row>
			)}

			<br />
		</Form>
	)
}

export default IssueBonusManagementInfoForm
