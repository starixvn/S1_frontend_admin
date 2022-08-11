import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetBankListArgs {
	siteId?: number
	userName: string
	sabaId: string
}

export type ILocalBankData = {
	sysId: number
	accountNo: string
	ifscCode: null
}

export type ICryptoData = {
	network: string
	currencyId: number
	currencyName: string
	nickName: string
	usdtAddress: string
}

export type IBankListData = {
	value: number
	content: string
}

export interface IGetBankListData {
	custId: number
	currencyId: number
	accountName: string
	eligibleWithdrawal: number
	existLocalBankList: ILocalBankData[]
	existCryptoList: ICryptoData[]
	localBankSysList: IBankListData[]
}

export type IGetBankListResponse = IAxiosResponse<IGetBankListData>

export interface IGetPaymentTypeData {
	name: string
	value: number
}

export type IGetPaymentTypeResponse = IAxiosResponse<IGetPaymentTypeData[]>

export type ICryptoCurrencyData = {
	currencyId: number
	currencyName: string
}

export type ICryptoNetwork = {
	networkType: number
	currencyId: number
	network: string
}

export type ICryptoInfoList = {
	cryptoCurrency: ICryptoCurrencyData[]
	cryptoNetwork: ICryptoNetwork[]
}
export type IGetCryptoInfoResponse = IAxiosResponse<ICryptoInfoList>

export interface ISubmitArgs {
	custId: number
	paymentId: number
	cryptoNetwork?: string | null
	cryptoCurrencyId?: number | null
	isExistBankCard: boolean
	sysId: number
	accountNo: string
	accountHolderName: string
	amount: number
	memo: string
}

export type LocalAccountNoSelectValue = {
	accountNo: string
	sysId: number
}
export type CryptoAccountNoSelectValue = {
	network: string
	currencyName: string
	usdtAddress: string
}
