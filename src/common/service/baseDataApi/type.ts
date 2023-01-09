import { IAxiosResponse } from '../axiosBaseQuery'

export interface IBankInfoOffState {
	accountCode: string
	bankId: number
	isoCode: string
	accountName: string
	accountNo: string
	accountStatus: number
	sysId: number
	minAmount: number
	maxAmount: number
	pointLevel: number
	purpose: number
	memo: null | string
	bSort: number
	currencyId: number
	bankCode: string
	bankName: string
	bankStatus: null | number
	bankLogo: string
	bankSite: string
	sort: number
	ver: number
	channel: number
	corporateID: string
	displayName: string
	bankLoginAccount: string
	bankLoginPassword: string
	bankLoginUrl: string
	loginPin: string
	mobilePin: string
	transferPin: string
	pointLevels: number[]
	purposes: number[]
	settingStatus: number
	siteId: number
	siteName: string
	vipLevels: number[]
}

export type BankInfoOffResponse = IAxiosResponse<IBankInfoOffState[]>

export interface IBankCodeData {
	sysId: number
	currencyId: number
	bankCode: string | null
	bankName: string | null
}

export type IBankCodeResponse = IAxiosResponse<IBankCodeData[]>

export interface IGetBankCodeListArgs {
	siteId?: number
	/**
	 * @argument 0 - 全部
	 */
	currency: number
}

export interface IVipLevelEnumData {
	level: number
	levelName: string
}

export type IVipLevelEnumResponse = IAxiosResponse<IVipLevelEnumData[]>

export interface IGetVipLevelSettingBySiteIdArgs {
	siteId?: number
}

export interface ICalCodeData {
	bankId: number
	calCodeName: string | null
	currencyId: number
	sysId: number
}

export type ICalCodeResponse = IAxiosResponse<ICalCodeData[]>

export enum CalCodePurposeEnum {
	Deposit = 1,
	Withdrawal,
}
export interface IGetCalCodeListArgs {
	siteId?: number
	purpose: CalCodePurposeEnum
}

export interface IPaymentData {
	payId: number
	payName: string
	channelId: number
	loginUrl: string
	loginAccount: string
	loginPassword: string
	transferPin: string
	loginPin: string
}

// GetGameIdByTpIdAndCategoryId
export interface IGetGameListArgs {
	tpId: number
	categoryId: number
}

export interface IGameList {
	gameCasinoId: number
	tpId: number
	gameId: string
	name: string
}

// 取得可用的 OnlinePayList
export interface IGetOnlinePayListArgs {
	currencyId: number
	sysId: number
	amount: number
	custId: number
}

export interface IOnlinePayData {
	payId: number
	payName: string
	channelId: number
	loginUrl: string
	loginAccount: string
	loginPassword: string
	transferPin: string
	loginPin: string
}

// 取得可用的 CryptoPay List
export interface IGetCryptoPayListArgs {
	currencyId: number
	channelName: string
	amount: number
	custId: number
}

export type ICryptoPayData = IOnlinePayData

// 取得可用的 cryptoWallet
export interface IGetCryptoWalletArgs {
	purpose: number
	currencyId: number
}

export type ICryptoWalletData = IBankInfoOffState
