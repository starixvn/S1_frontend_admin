import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment/moment'

export interface IForm {
	dateRange: [Moment, Moment]
}

export interface IGameStatisticalReportData {
	currencyId: number
	currencyName: string
	categoryDetail: ICategoryDetailData[]
}

export interface ICategoryDetailData {
	categoryId: number
	categoryName: string
	gameDetail: IGameDetailData[]
}

export interface IGameDetailData {
	currencyId: number
	currencyName: string
	tpId: number
	tpName: string
	categoryId: string
	categoryName: string
	gameType: number
	gameTypeName: string
	gameName: string
	uniquePlayers: number
	validBetSummary: number
	winLossSummary: number
}

export interface IGetGameStatisticalReportListArgs {
	siteId?: number
	startDate: string
	endDate: string
}

export type IGameStatisticalReportResponse = IAxiosResponse<
	IGameStatisticalReportData[]
>
