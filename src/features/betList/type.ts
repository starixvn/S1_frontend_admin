import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetBetListArgs {
	pageNumber: number
	pageSize: number
	siteIds: number[]
	currencyIds: number[]
	tags: number[]
	viPlevel: number
	tpId: number
	userName: string
	tpUserName: string
	refNo: string
	provider: string
	product: string
	category: string
	game: string
	title: string
	matchID: string
	betType: string
	ip: string
	startTime: string
	endTime: string
	stake: number
	winlostAmount: number
}

export interface IGetBetListData {
	siteId: string
	currencyId: string
	userName: string
	tpUserName: string
	tpId: number
	transId: string
	gameType: number
	transTime: string
	settledTime: string
	stake: number
	validBet: number
	winlostAmount: number
	providerID: string
	currency: string
	refNo: string
	gameID: string
	provider: string
	product: string
	category: string
	game: string
	title: string
	matchID: string
	betType: string
	betChoice: string
	result: string
	odds: number
	oddsType: string
	platform: string
	live: string
	ip: string
	tagList: string
	vipLevel: number
	levelName: string
}
export type IGetBetListResponse = IAxiosResponse<IGetBetListData[]>
