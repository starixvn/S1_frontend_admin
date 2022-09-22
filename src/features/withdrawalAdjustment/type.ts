import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetWithdrawalAdjustmentArgs {
	siteId?: number
	userName: string
	sabaId: string
}

export interface IGetWithdrawalAdjustmentData {
	siteId: number
	siteName: string
	custId: number
	userName: string
	currency: number
	balance: number
	differenceAmount: number
	eligibleWithdrawalAmount: number
}

export type IGetWithdrawalAdjustmentResponse =
	IAxiosResponse<IGetWithdrawalAdjustmentData>

export interface ISubmitWithdrawalLimitAdjustArgs {
	custId: number
	adjustType: number
	reasonId: number
	amount: number
	memo: string
}

export interface IGetReasonListData {
	name: string
	value: number
}

export type IGetWithdrawalReasonListResponse = IAxiosResponse<
	IGetReasonListData[]
>
