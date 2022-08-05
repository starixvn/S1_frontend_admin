import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetAdjustmentTypeData {
	id: number
	name: string
}

export type IGetAdjustmentTypeResponse = IAxiosResponse<
	IGetAdjustmentTypeData[]
>

export interface IGetCustInfoWithBalanceArgs {
	siteId?: number
	userName: string
	sabaId: string
}

export interface ICustInfoWithBalanceData {
	balance: number
	currencyId: number
	custId: number
	siteId: number
	siteName: string
	status: number
	userName: string
}

export type ICustInfoWithBalanceResponse =
	IAxiosResponse<ICustInfoWithBalanceData>

export interface IGetCustDetailData {
	custId: number
	userName: string
	balance: number
}

export type IGetReasonListData = IGetAdjustmentTypeData

export type IGetReasonListResponse = IAxiosResponse<IGetReasonListData[]>

// 設定調帳
export interface ISubmitAdjustmentArgs {
	custId: number
	adjustmentType: number | null
	amount: number | null
	withdrawalLimitAmount: number
	withdrawalLimitOption: number
	memo: string
	reasonId: number | null
	transId: string
}

export interface IAdjustmentLimitInfo {
	adjustmentMax: number
	currencyId: number
	siteId: number
	updateOperator: string
	updateTime: string
}

export type IAdjustmentLimitResponse = IAxiosResponse<
	IAdjustmentLimitInfo | undefined
>

export interface IGetAdjustmentLimitInfoArgs {
	siteId?: number
	currencyId?: number
}

export interface ICheckPasswordArgs {
	siteId: number
	password: string
}
