import { WithdrawalTypeEnum } from 'features/withdrawalOperator/constants'
import {
	IGetBankInfoData,
	IGetCryptoPayData,
	IGetOnlinePayData,
	IPayInfo,
} from 'features/withdrawalOperator/type'
import { assign } from 'lodash'

export const hashPayInfo = (
	type: WithdrawalTypeEnum,
	record: IGetOnlinePayData | IGetCryptoPayData | IGetBankInfoData
): IPayInfo => {
	const result = {}
	if (type !== WithdrawalTypeEnum.LocalBank) {
		const {
			payName,
			loginUrl,
			loginPin,
			loginAccount,
			loginPassword,
			transferPin,
		} = record as IGetOnlinePayData
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
			bankLoginPassword,
			bankLoginAccount,
			bankLoginUrl,
			transferPin,
			corporateID,
		} = record as IGetBankInfoData
		assign(result, {
			accountNo: displayName,
			loginPin,
			loginAccount: bankLoginAccount,
			loginPassword: bankLoginPassword,
			loginUrl: bankLoginUrl,
			mobilePin,
			transferPin,
			corporateID,
		} as IPayInfo)
	}
	return result as IPayInfo
}
