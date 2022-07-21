import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetWorldCupReportArg {
	siteId?: number
}

export interface IGetWorldCupReportData {
	teamId: number
	teamName: string
	predictUserCount: number
	isPayoutDone: boolean
	operator: string | null
	updateTime: string | null
}

export type IGetWorldCupReportResponse = IAxiosResponse<
	IGetWorldCupReportData[]
>

export interface IExportWorldCupReportArgs {
	siteId?: number
	teamId: number
	timezone: number | string
}

export interface ISetPayoutArgs {
	siteId?: number
	teamId: number
}
