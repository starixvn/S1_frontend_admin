import { WithdrawalTypeEnum } from 'features/withdrawalOperator/constants'
import { IPayInfoWithBankLoginInfo } from 'features/withdrawalOperator/type'
import { assign } from 'lodash'
import {
	IBankInfoOffState,
	ICryptoPayData,
	IOnlinePayData,
} from 'common/service/baseDataApi/type'

export const hashPayInfo = (
	type: WithdrawalTypeEnum,
	record: IOnlinePayData | ICryptoPayData | IBankInfoOffState
): IPayInfoWithBankLoginInfo => {
	const result = {}
	if (
		type !== WithdrawalTypeEnum.LocalBank &&
		type !== WithdrawalTypeEnum.CryptoWallet
	) {
		const { payName, loginUrl, loginPin, bankLoginInfo, transferPin } =
			record as IOnlinePayData
		assign(result, {
			accountNo: payName,
			loginUrl,
			loginPin,
			bankLoginInfo,
			transferPin,
		} as IPayInfoWithBankLoginInfo)
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
	return result as IPayInfoWithBankLoginInfo
}
