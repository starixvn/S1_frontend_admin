import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetHotEventListArgs {
	siteId?: number
	status: number
	sportLeaguesTitleId: number
	pageSize: number
	pageNumber: number
}

export interface IGetHotEventListData {
	id: number
	sportLeaguesTitle: string
	homeTeamName: string
	awayTeamName: string
	status: number
	startTime: string
	endTime: string
	battleTime: string
	lastUpdateUser: string
	lastUpdateTime: string
	isLiveStreaming: boolean
	iCurrencyList: number[]
	isPrediction: boolean
	bonusCode: string
}

export type IGetHotEventListResponse = IAxiosResponse<IGetHotEventListData[]>

export interface IGetHotEventDetailArgs {
	id: number
}

export interface IGetHotEventDetailData {
	id: number
	sportLeaguesTitleId: number
	matchId: number
	startTime: string
	endTime: string
	battleTime: string
	homeSportLeaguesId: number
	awaySportLeaguesId: number
	homeTeamNameId: number
	awayTeamNameId: number
	isLiveStreaming: boolean
	iCurrencyList: number[]
	isPrediction: boolean
}

export type IGetHotEventDetailResponse = IAxiosResponse<IGetHotEventDetailData>

export interface ICreateHotEventArgs {
	siteId?: number
	tpId: number
	gameId: number
	sportLeaguesTitleId: number
	matchId: number
	startTime: string
	endTime: string
	battleTime: string
	homeSportLeaguesId: number
	awaySportLeaguesId: number
	homeTeamNameId: number
	awayTeamNameId: number
	isLiveStreaming: boolean
	currency: string
	isPrediction: boolean
}

export interface ISetHotEventArgs {
	id: number
	sportLeaguesTitleId: number
	matchId: number
	startTime: string
	endTime: string
	battleTime: string
	homeSportLeaguesId: number
	awaySportLeaguesId: number
	homeTeamNameId: number
	awayTeamNameId: number
	currency: string
	isLiveStreaming: boolean
	isPrediction: boolean
}

export interface ISetHotEventStatusArgs {
	id: number
	status: number
}

export interface IDeleteHotEventArgs extends IGetHotEventDetailArgs {}

// sport League Title
export interface IGetSportLeaguesTitleData {
	sportLeaguesTitleId: number
	sportLeaguesTitle: string
}

export type IGetSportLeaguesTitleResponse = IAxiosResponse<
	IGetSportLeaguesTitleData[]
>

// sport League
export interface IGetSportLeaguesData {
	sportLeaguesId: number
	sportLeaguesName: string
}

export type IGetSportLeaguesResponse = IAxiosResponse<IGetSportLeaguesData[]>

// sport Team
export interface IGetSportTeamsArgs {
	sportLeaguesId: number
}

export interface IGetSportTeamsData {
	teamId: number
	teamName: string
}

export type IGetSportTeamsResponse = IAxiosResponse<IGetSportTeamsData[]>

export enum HotEventMethodEnum {
	Create = 'Create',
}
