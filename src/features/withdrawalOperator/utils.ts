import { WithdrawalTypeEnum } from 'features/withdrawalOperator/constants'
import {
	IPayInfo,
	IPayInfoWithBankLoginInfo,
} from 'features/withdrawalOperator/type'
import { assign } from 'lodash'
import {
	IBankInfoOffState,
	ICryptoPayData,
	IOnlinePayData,
} from 'common/service/baseDataApi/type'

export const hashPayInfo = (
	type: WithdrawalTypeEnum,
	record: IOnlinePayData | ICryptoPayData | IBankInfoOffState
) => {
	const result: Partial<IPayInfo | IPayInfoWithBankLoginInfo> = {}
	if (
		type !== WithdrawalTypeEnum.LocalBank &&
		type !== WithdrawalTypeEnum.CryptoWallet
	) {
		const {
			payName,
			loginUrl,
			loginPin,
			loginAccount,
			loginPassword,
			transferPin,
		} = record as IOnlinePayData
		assign(result, {
			accountNo: payName,
			loginUrl,
			loginPin,
			loginAccount,
			loginPassword,
			transferPin,
		} as IPayInfo)
	} else {
		const {
			displayName,
			loginPin,
			mobilePin,
			bankLoginInfo,
			bankLoginUrl,
			transferPin,
			corporateID,
		} = record as IBankInfoOffState
		assign(result, {
			accountNo: displayName,
			loginPin,
			bankLoginInfo,
			loginUrl: bankLoginUrl,
			mobilePin,
			transferPin,
			corporateID,
		} as IPayInfoWithBankLoginInfo)
	}
	return result as IPayInfo | IPayInfoWithBankLoginInfo
}
