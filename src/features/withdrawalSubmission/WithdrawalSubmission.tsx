import { FC, useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message } from 'antd'
import {
	useGetCryptoInfoQuery,
	useGetPaymentTypeQuery,
	useLazyGetBankListQuery,
	useLazyGetExchangeInfoQuery,
	useSubmitWithdrawalMutation,
} from 'features/withdrawalSubmission/api'
import {
	CryptoAccountNoSelectValue,
	IFilterForm,
	IGetBankListResponse,
	IGetCryptoInfoResponse,
	ISubmitArgs,
	IWithdrawalForm,
	LocalAccountNoSelectValue,
} from 'features/withdrawalSubmission/type'
import { WithdrawalSubmissionFilter } from 'features/withdrawalSubmission/WithdrawalSubmissionFilter'
import { WithdrawalSubmissionForm } from 'features/withdrawalSubmission/WithdrawalSubmissionForm'
import {
	channelConverter,
	IChannelValue,
} from 'features/withdrawalSubmission/converter'
import { useAuth, useQueryParams } from 'common/hooks'
import { isEmpty, split } from 'lodash'
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

	const [filterForm] = Form.useForm<IFilterForm>()

	const [withdrawalForm] = Form.useForm<IWithdrawalForm>()

	const {
		data: { data: paymentTypeList = [] } = {},
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

	const [getExchangeInfo, { isFetching: isGetExchangeInfoLoading }] =
		useLazyGetExchangeInfoQuery()

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
			rate,
			exchangeAmount,
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
					exchangeRate: rate,
					exchangeAmount,
				}
				arg = { ...arg, ...restArgs }
			} else {
				const restArgs = {
					cryptoCurrencyId,
					cryptoNetwork,
					accountNo: rawAccountNo,
					exchangeRate: rate,
					exchangeAmount,
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

	const handleCheckCryptoAmount = async () => {
		const { channel, amount } = withdrawalForm.getFieldsValue()
		const { currencyId } = custBankData
		// displayName 的組成： "currency - network"
		// 拆解 displayName 來取得 api 需要的資料
		const { displayName } = JSON.parse(channel)
		// 0 為 cryptoCurrencyName , 1 為 network
		const cryptoValue = split(displayName, '-')
		// 防呆，解出來沒有兩個值就不打 api
		if (cryptoValue?.length !== 2) return
		try {
			const { data: { exchangeAmount, rate } = {} } = await getExchangeInfo({
				cryptoCurrencyName: cryptoValue[0],
				network: cryptoValue[1],
				currencyId,
				amount,
			}).unwrap()
			withdrawalForm.setFieldsValue({
				rate,
				exchangeAmount,
			})
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
		isSubmitWithdrawalLoading ||
		isGetExchangeInfoLoading

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
					onCheckCryptoAmount={handleCheckCryptoAmount}
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
