import { FC, useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message } from 'antd'
import {
	useGetCryptoInfoQuery,
	useGetPaymentTypeQuery,
	useLazyGetBankListQuery,
	useSubmitWithdrawalMutation,
} from 'features/withdrawalSubmission/api'
import {
	CryptoAccountNoSelectValue,
	IGetBankListResponse,
	IGetCryptoInfoResponse,
	IGetPaymentTypeResponse,
	ISubmitArgs,
	LocalAccountNoSelectValue,
} from 'features/withdrawalSubmission/type'
import { WithdrawalSubmissionFilter } from 'features/withdrawalSubmission/WithdrawalSubmissionFilter'
import { WithdrawalSubmissionForm } from 'features/withdrawalSubmission/WithdrawalSubmissionForm'
import {
	channelConverter,
	IChannelValue,
} from 'features/withdrawalSubmission/converter'
import { useAuth, useQueryParams } from 'common/hooks'
import { isEmpty } from 'lodash'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import {
	PaymentEnum,
	UsedCardEnum,
} from 'features/withdrawalSubmission/constants'

const WithdrawalSubmission: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const [filterForm] = Form.useForm<{
		userName: string
		sabaId: string
	}>()

	const [withdrawalForm] = Form.useForm<{
		paymentId: number
		channel: string
		isExistBankCard: number
		accountNo: string
		bankName: string | number
		accountHolderName: string
		eligibleWithdrawal: number
		amount: number
		memo: string
	}>()

	const {
		data: { data: paymentTypeList } = {} as IGetPaymentTypeResponse,
		isLoading: isGetPaymentTypeLoading,
	} = useGetPaymentTypeQuery(null)

	const {
		data: { data: cryptoInfoList } = {} as IGetCryptoInfoResponse,
		isLoading: isGetCryptoInfoLoading,
	} = useGetCryptoInfoQuery(null)
	// 渲染 和 submit 用
	const channelList = channelConverter(cryptoInfoList)

	const [
		getBankList,
		{
			data: { data: custBankData } = {} as IGetBankListResponse,
			isFetching: isGetBankListLoading,
		},
	] = useLazyGetBankListQuery()

	const [submitWithdrawal, { isLoading: isSubmitWithdrawalLoading }] =
		useSubmitWithdrawalMutation()

	const handleSearch = async () => {
		const args = filterForm.getFieldsValue()
		try {
			await getBankList({
				siteId,
				...args,
			}).unwrap()
			setQueryParams({
				...args,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSubmit = async () => {
		const {
			paymentId,
			amount,
			accountNo: rawAccountNo,
			isExistBankCard,
			accountHolderName,
			memo,
			bankName,
			channel,
		} = await withdrawalForm.validateFields()
		const { custId } = custBankData

		let arg: ISubmitArgs = {
			custId,
			paymentId,
			amount,
			accountHolderName,
			isExistBankCard: Boolean(isExistBankCard),
			memo,
			sysId: 0,
			accountNo: '',
		}
		if (paymentId === PaymentEnum.LocalBank) {
			if (isExistBankCard === UsedCardEnum.MemberCard) {
				const { sysId, accountNo } = JSON.parse(
					rawAccountNo
				) as LocalAccountNoSelectValue
				const restArgs = {
					sysId,
					accountNo,
				}
				arg = { ...arg, ...restArgs }
			} else {
				const restArgs = {
					accountNo: rawAccountNo,
					sysId: Number(bankName),
				}
				arg = { ...arg, ...restArgs }
			}
		} else {
			// paymentType = crypto
			const { cryptoCurrencyId, cryptoNetwork } = JSON.parse(
				channel
			) as IChannelValue
			if (isExistBankCard === UsedCardEnum.MemberCard) {
				const { usdtAddress } = JSON.parse(
					rawAccountNo
				) as CryptoAccountNoSelectValue
				const restArgs = {
					cryptoCurrencyId,
					cryptoNetwork,
					accountNo: usdtAddress,
				}
				arg = { ...arg, ...restArgs }
			} else {
				const restArgs = {
					cryptoCurrencyId,
					cryptoNetwork,
					accountNo: rawAccountNo,
				}
				arg = { ...arg, ...restArgs }
			}
		}
		try {
			const response = await submitWithdrawal(arg).unwrap()
			withdrawalForm.resetFields()
			message.success(response.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const { userName = '', sabaId = '' } = queryParams
			filterForm.setFieldsValue({
				userName,
				sabaId,
			})
			handleSearch()
		}
		init()
	}, [])

	const loading =
		isGetPaymentTypeLoading ||
		isGetCryptoInfoLoading ||
		isGetBankListLoading ||
		isSubmitWithdrawalLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalSubmissionFilter
				form={filterForm}
				loading={loading}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<WithdrawalSubmissionForm
					loading={loading}
					form={withdrawalForm}
					paymentTypeList={paymentTypeList}
					custBankList={custBankData}
					channelList={channelList}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				{!isEmpty(queryParams) && (
					<AffixButtons.Saved
						disabled={!editPermission?.canUse}
						onClick={handleSubmit}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WithdrawalSubmission
