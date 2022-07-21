import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetMemberReportArgs {
	siteId?: number
	currencyId: number
	ticketType: number
	teamId: number
	selected: number
	userName: string
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export interface IGetMemberReportData {
	currency: string
	userName: string
	ticketType: number
	teamName: string
	selectTime: string | null
}

export type IGetMemberReportResponse = IAxiosResponse<IGetMemberReportData[]>

export interface IExportMemberReportArgs {
	siteId?: number
	currencyId: number
	ticketType: number
	teamId: number
	selected: number
	userName: string
	startTime: string
	endTime: string
}

export interface IWorldCupTeams {
	countryId: number
	countryName: string
}
export interface IGetWorldSettingData {
	selectOptions: IWorldCupTeams[]
}

export type IGetWorldCupSettingResponse = IAxiosResponse<IGetWorldSettingData>
export type IWorldCupTeamResponse = IAxiosResponse<IWorldCupTeams[]>
