import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetBetListArgs {
	pageNumber: number
	pageSize: number
	siteIds: number[]
	currencyIds: number[]
	tags: number[]
	vipLevel: number
	tpId: number
	userName: string
	tpUserName: string
	refNo: string
	gameType: number
	category: string
	game: string
	title: string
	matchID: string
	betType: string
	ip: string
	startTime: string
	endTime: string
	stake: number
	transId: string
	winLostAmount: number
	orderBy?: boolean
	orderByProperty?: string
	orderByDirection?: number
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
	tags: number[]
	vipLevel: number
	levelName: string
}
export type IGetBetListResponse = IAxiosResponse<IGetBetListData[]>

export interface IGetCategoryData {
	categoryId: number
	categoryName: string
}
export type IGetCategoryResponse = IAxiosResponse<IGetCategoryData[]>

export interface IGetProvidersData {
	id: number
	tpName: string
}

export type IGetProvidersResponse = IAxiosResponse<IGetProvidersData[]>

export interface IGetProductsData {
	type: number
	typeName: string
	tpId: number
	categoryId: number
}

export type IGetProductsResponse = IAxiosResponse<IGetProductsData[]>

export interface IGetVipLevels {
	siteId: number
	level: number
	levelName: string
	fixed: number
	createTime: string
	updateTime: string
}

export type IGetVipLevelsResponse = IAxiosResponse<IGetVipLevels[]>

export interface IGetTagsData {
	id: number
	tagName: string
	tagColour: string
	status: number
	description: string
	creator: string
	updateTime: string
	updator: string
}

export type IGetTagsResponse = IAxiosResponse<IGetTagsData[]>

export enum OrderByTypeEnum {
	ascend, // 升序
	descend,
}
