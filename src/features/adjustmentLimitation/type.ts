import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetAdjustmentListArgs {
	siteId?: number
}

export interface IGetAdjustmentListData {
	siteId: number
	currencyId: number
	currencyName: string
	adjustmentMax: number
}

export type IGetAdjustmentListResponse = IAxiosResponse<
	IGetAdjustmentListData[]
>

export type IUpdateAdjustmentLimitData = {
	adjustmentMax: number
}

export interface IUpdateAdjustmentLimitArgs {
	siteId?: number
	currencyId: number
	before: IUpdateAdjustmentLimitData
	after: IUpdateAdjustmentLimitData
}
