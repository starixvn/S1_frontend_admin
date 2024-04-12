import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetCupEventReportArg {
	siteId?: number
}

export interface IGetCupEventReportData {
	teamId: number
	teamName: string
	predictUserCount: number
	isPayoutDone: boolean
	operator: string | null
	updateTime: string | null
}

export type IGetCupEventReportResponse = IAxiosResponse<
	IGetCupEventReportData[]
>

export interface IExportCupEventReportArgs {
	siteId?: number
	teamId: number
	timezone: number | string
}

export interface ISetPayoutArgs {
	siteId?: number
	teamId: number
}
