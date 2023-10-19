import { useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Col, Form, FormInstance, Input, message, Row } from 'antd'
import { ConfirmPasswordModal } from 'components/Modal'
import { useModal } from 'common/hooks'
import { isNumber } from 'lodash'
import {
	useLazyCheckBonusCodeQuery,
	useLazyCheckTierRedepositBonusQuery,
	useSetBonusPayoutMutation,
} from './api'
import {
	ICheckBonusCodeResponse,
	ICheckTierRedepositBonusResponse,
	ICustInfoDetailsData,
} from './type'
import IssueBonusManagementBonusDescription from './IssueBonusManagementBonusDescription'
import IssueBonusManagementInfoForm from './IssueBonusManagementInfoForm'
import { StyleButton } from './StyleButton'

interface IIssueBonusManagementInfoContentProps {
	infoForm: FormInstance
	custInfoDetails: ICustInfoDetailsData
	adjustmentMax: number | undefined
	siteId: number | undefined
	onClear: () => void
}

const IssueBonusManagementInfoContent = ({
	infoForm,
	custInfoDetails,
	adjustmentMax,
	siteId,
	onClear,
}: IIssueBonusManagementInfoContentProps) => {
	const { t } = useTranslation()
	const checkPasswordModal = useModal()
	const [depositId, setDepositId] = useState<string>('')
	const { custId, currencyId } = custInfoDetails ?? {}
	const bonusCode = Form.useWatch('bonusCode', infoForm)
	const [bonusPayoutAmount, setBonusPayoutAmount] = useState<number>(0)
	const [
		checkBonusCode,
		{
			data: { data: bonusCodeInfo } = {} as ICheckBonusCodeResponse,
			isFetching: isCheckBonusCodeFetching,
		},
	] = useLazyCheckBonusCodeQuery()

	const [setBonusPayout, { isLoading: isSetBonusPayoutLoading }] =
		useSetBonusPayoutMutation()

	const [
		checkTierRedepositBonus,
		{
			data: {
				data: tierDepositBonusInfo,
			} = {} as ICheckTierRedepositBonusResponse,
			isFetching: isCheckTierRedepositBonusFetching,
		},
	] = useLazyCheckTierRedepositBonusQuery()

	const handleCheckBonusCode = async () => {
		if (!siteId) return
		await infoForm.validateFields()

		try {
			const { data } = await checkBonusCode({
				siteId,
				currencyId,
				bonusCode,
			}).unwrap()
			if (!data.hasBonusCode) {
				message.warn('BonusCode Error')
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetBonusPayout = async (newAmount: number | null) => {
		const { rollOver, promotionType } = bonusCodeInfo ?? {}

		try {
			await setBonusPayout({
				custId,
				amount: newAmount ?? bonusPayoutAmount,
				bonusCode,
				rollOver,
				promotionType,
				depositId,
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCheckTierRedepositBonus = async (newDepositId: string) => {
		if (!siteId) return

		try {
			const args = {
				custId,
				bonusCode,
				siteId,
				currencyId,
				depositId: newDepositId,
			}

			await checkTierRedepositBonus(args).unwrap()
			setDepositId(newDepositId)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
			setDepositId('')
		}
	}

	const handleCheckPasswordModal = async (newAmount: number) => {
		if (!isNumber(adjustmentMax)) return

		if (newAmount >= adjustmentMax) {
			setBonusPayoutAmount(newAmount)
			checkPasswordModal.onOpen()
		} else {
			handleSetBonusPayout(newAmount)
		}
	}

	const loading =
		isCheckBonusCodeFetching ||
		isSetBonusPayoutLoading ||
		isCheckTierRedepositBonusFetching

	return (
		<LayoutContent.Card>
			<Form
				layout='vertical'
				size='middle'
				form={infoForm}
				onFinish={handleCheckBonusCode}
				initialValues={{
					bonusCode: '',
				}}
			>
				<Row align='middle' gutter={16} justify='space-between'>
					<Col lg={6} md={12} xs={12}>
						<Form.Item
							name='bonusCode'
							label={t('Label_BonusCode')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_BonusCode'),
									}),
								},
							]}
						>
							<Input allowClear placeholder={t('Label_BonusCode')} />
						</Form.Item>
					</Col>

					<Col lg={6} md={12} xs={12}>
						<Form.Item label=' '>
							<StyleButton loading={loading} htmlType='submit' type='primary'>
								{t('Label_CheckBonusCode')}
							</StyleButton>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			{bonusCodeInfo && (
				<>
					<IssueBonusManagementBonusDescription bonusCodeInfo={bonusCodeInfo} />

					<IssueBonusManagementInfoForm
						loading={loading}
						bonusCodeInfo={bonusCodeInfo}
						tierDepositBonusInfo={tierDepositBonusInfo}
						onClear={onClear}
						onCheckPasswordModal={handleCheckPasswordModal}
						onCheckTierRedepositBonus={handleCheckTierRedepositBonus}
					/>
				</>
			)}

			<ConfirmPasswordModal
				{...checkPasswordModal}
				onFinish={() => {
					handleSetBonusPayout(null)
					checkPasswordModal.onCancel()
				}}
			/>
		</LayoutContent.Card>
	)
}

export default IssueBonusManagementInfoContent
