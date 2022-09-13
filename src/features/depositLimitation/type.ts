import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetDepositLimitArgs {
	siteId?: number
	currencyId: number
}

export interface IGetDepositLimitData {
	vipLevel: number
	depositMin: number
	depositMax: number
	depositStatus: number
	siteId: number
	depositType: number
	currencyId: number
}

export type IGetDepositLimitResponse = IAxiosResponse<IGetDepositLimitData[]>

export type IUpdateDepositLimitData = {
	depositType: number
	vipLevel: number
	depositMin: number | null
	depositMax: number | null
	depositStatus: number | null
}

export interface IUpdateDepositLimitArgs extends IGetDepositLimitArgs {
	before: IUpdateDepositLimitData[]
	after: IUpdateDepositLimitData[]
}

export interface ICreateDepositLimitArgs extends IGetDepositLimitArgs {
	after: IUpdateDepositLimitData[]
}

export type IDeleteDepositLimitData = {
	vipLevel: number
}

export interface IDeleteDepositLimitArgs extends IGetDepositLimitArgs {
	before: IDeleteDepositLimitData
}

// 目前有使用到的 depositType 有需要再手動加
export enum DepositTypeEnum {
	OnlineBanking = 1,
	MobilePay,
	LocalBanking,
}

export type IDepositTableData = {
	vipLevel: number
	onlineBankingMax: number | null
	onlineBankingMin: number | null
	onlineBankingStatus: number | null
	mobilePayMax: number | null
	mobilePayMin: number | null
	mobilePayStatus: number | null
	localBankingMax: number | null
	localBankingMin: number | null
	localBankingStatus: number | null
}

// form 在 input 就不允許有 null , switch 可能有 number , boolean , null
export type IDepositTableFormData = {
	vipLevel: number
	onlineBankingMax: number
	onlineBankingMin: number
	onlineBankingStatus: number | boolean | null
	mobilePayMax: number
	mobilePayMin: number
	mobilePayStatus: number | boolean | null
	localBankingMax: number
	localBankingMin: number
	localBankingStatus: number | boolean | null
}

export enum ErrorCodeEnum {
	DuplicatePointLevel = -5,
}
