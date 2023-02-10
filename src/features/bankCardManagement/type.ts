import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetBankCardListArgs {
	siteId?: number
	currencyId: number
	purposes: number[]
	statuses: number[]
	sysIds: number[]
	vipLevels: number[]
	pointLevels: number[]
	supportChannels: number[]
	agent: string
	accountNo: string
	pageNumber: number
	pageSize: number
}

export interface IGetBankCardListData {
	financialAccountId: number
	accountName: string
	accountNo: string
	agent: string
	accountCode: null | string
	minAmount: number
	maxAmount: number
	dailyLimitAmount: number
	purposes: string[]
	currencyId: number
	sysId: number
	bankCode: string
	bankName: string
	status: number
	pointLevels: number[]
	vipLevels: number[]
	vipLevelNames: string[]
	supportChannels: number[]
	supportChannelNames: string[]
	qrCodeUrl: string | null
	dummy: number
	memo: null | string
	sort: number
	lastUpdateTime: string
	lastUpdater: null | string
}

export type IGetBankCardListResponse = IAxiosResponse<IGetBankCardListData[]>

export interface ISetBankCardArgs {
	financialAccountId: number
	siteId?: number
	currencyId: number
	minAmount: number
	maxAmount: number
	dailyLimitAmount: number
	vipLevels: number[]
	pointLevels: number[]
	memo: string
	sort: number
	status: number
	supportChannels: number[]
	qrCodeUrl: string | null
}

export interface IGetPointLevelListArgs {
	siteId?: number
	currencyId: number
}

export type IGetPointLevelListResponse = IAxiosResponse<number[]>

export interface IGetBankInfoArgs {
	currencyId: number
}

export interface IGetBankInfoData {
	sysId: number
	currencyId: number
	bankCode: string
	bankName: string
	bankLogo: string
	bankSite: string
}

export type IGetBankInfoResponse = IAxiosResponse<IGetBankInfoData[]>

export interface IGetAgentListArgs {
	siteId?: number
}

export type IGetAgentListResponse = IAxiosResponse<string[]>

export type IGetQrCodeUrlResponse = IAxiosResponse<{ qrCodeUrl: string }>

export enum SupportChannelEnum {
	LocalBank,
	EWallet,
}

export enum BankCardListStatusEnum {
	Initial,
	Open,
	Suspend,
	Closed,
	Maintenance,
}
