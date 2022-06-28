import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetRedemptionLimitArg {
	siteId?: number
}

interface IGetRedemptionLimitData {
	limit: number
	status: number
	lastUpdater: string
	lastUpdateTime: string | null
}

export type IGetRedemptionLimitResponse =
	IAxiosResponse<IGetRedemptionLimitData>

export interface ISetRedemptionLimitArgs {
	siteId?: number
	status: number
	limit: number
}
