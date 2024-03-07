import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetTpListData {
	tpId: number
	tpName: string
}

export type IGetTpListResponse = IAxiosResponse<IGetTpListData[]>

export interface IGetSlotGamesListArgs {
	siteId?: number
	pageNumber: number
	pageSize: number
	tpId: number
	name: string
	status: number
	gameId: string
}

export type ICurrencyStatusData = {
	currencyId: number
	status: number
}

export interface IGetSlotGamesListData {
	updateTime: string
	tpId: number
	id: number
	gameId: string
	eName: string
	cName: string
	operator: string
	currencyStatusList: ICurrencyStatusData[]
}

export type IGetSlotGamesListResponse = IAxiosResponse<IGetSlotGamesListData[]>

export interface ISetSlotGameArgs {
	siteId?: number
	currencyId: number
	slotGameId: number
	status: number
}

export interface IGetSlotGameCategoryListArgs {
	pageNumber: number
	pageSize: number
	siteId?: number
	tpId: number
	name: string
	category: number
}

export type IGetSlotGameCategoryListResponse = IGetSlotGamesListResponse

export interface ISetGameCategoryArgs {
	siteId?: number
	currencyId: number
	slotGameId: number
	categoryId: number
	status: number
}

export type ITableColumnsInfo = {
	title: string
	dataIndex: string
}

export type ISlotCategoryListData = {
	id: number
	name: string
}

export type IGetSlotCategoryListResponse = IAxiosResponse<
	ISlotCategoryListData[]
>

export interface ISlotGameAllCurrencyArgs {
	siteId: number
	slotGameId: number
	status: number
}

export interface ISetSlogGameEnvironmentArgs {
	slotGameId: number
	siteId: number
	isPRD: number
}

export interface ISetNewSlotGameArgs {
	tpId: number
	gameId: number
	enName: string
	csName: string
	rtp: number
	reel: string
	device: number
	payline: string
	fun: number
	currencyIds: number[]
	categoryIds: number[]
}

export interface ISlotGameForm extends Omit<ISetNewSlotGameArgs, 'fun'> {
	fun: boolean
}
