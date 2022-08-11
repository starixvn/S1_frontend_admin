import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetBankCardListArgs {
	siteId?: number
	currencyId: number
	purposes: number[]
	statuses: number[]
	sysIds: number[]
	vipLevels: number[]
	pointLevels: number[]
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

export interface IGetEnumData {
	name: string
	value: number
}

export type IGetPurposeEnumResponse = IAxiosResponse<IGetEnumData[]>

export type IGetStatusEnumResponse = IGetPurposeEnumResponse

export interface IGetAgentListArgs {
	siteId?: number
}

export type IGetAgentListResponse = IAxiosResponse<string[]>
