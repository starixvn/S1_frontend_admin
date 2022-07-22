import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetAdjustmentTypeData {
	id: number
	name: string
}

export type IGetAdjustmentTypeResponse = IAxiosResponse<
	IGetAdjustmentTypeData[]
>

export interface IGetCustDetailArgs {
	siteId?: number
	userName: string
	sabaId: string
}

export interface IGetCustDetailData {
	custId: number
	userName: string
	balance: number
}

export type IGetCustDetailResponse = IAxiosResponse<IGetCustDetailData>

export type IGetReasonListData = IGetAdjustmentTypeData

export type IGetReasonListResponse = IAxiosResponse<IGetReasonListData[]>

// 設定調帳
export interface ISubmitAdjustmentArgs {
	custId: number
	adjustmentType: number
	amount: number
	withdrawalLimitAmount: number
	withdrawalLimitOption: number
	memo: string
	reasonId: number
}
