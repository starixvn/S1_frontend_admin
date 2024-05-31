import { Dayjs } from 'dayjs'
import { IGameCasinoByIdData } from 'common/service/baseDataApi/type'

export interface IGetGameExclusionListArgs {
	startDate: string
	endDate: string
	siteId?: number
	userName: string
	pageNumber: number
	pageSize: number
}

export interface IGameExclusionData {
	siteId: number
	currencyId: number
	siteName: string
	custId: number
	userName: string
	status: number
	creator: string
	createTime: string
	updateOperator: string
	updateTime: string
}

export type IGameData = {
	gameId: string
	name: string
	checked: boolean
}

export interface IDisableGamesData {
	tpId: number
	tpName: string
	gameList: IGameData[] | null
	checked: boolean
}

export interface IGameExclusionByCustIdData {
	siteId: number
	userName: string
	disableGames: IDisableGamesData[]
}

export type IDisableTpGameData = {
	tpId: number
	gameList: string[]
}

export interface ISetGameExclusionArgs {
	siteId?: number
	userName: string
	disableTpGame: IDisableTpGameData[]
}

export type IUpdateGameExclusionStatusData = {
	userName: string
	custId: number
	status: number
}

export interface IUpdateGameExclusionStatusArgs {
	siteId?: number
	currencyId: number
	before: IUpdateGameExclusionStatusData
	after: IUpdateGameExclusionStatusData
}

export interface IFilterForm {
	userName: string
	dateRange: [Dayjs, Dayjs]
}

export type IDeleteGameExclusionData = Omit<
	IUpdateGameExclusionStatusData,
	'status'
>

export interface IDeleteGameExclusionArgs {
	siteId?: number
	currencyId: number
	before: IDeleteGameExclusionData
	after: IDeleteGameExclusionData
}

export enum GameExclusionMethodEnum {
	add = 'AddDisableUser',
}

// 渲染 Table 用的自組資料 Type
export type ITpGame = {
	tpId: number
	tpName: string
	tpGames: Omit<IGameCasinoByIdData, 'checked'>[]
}

// 渲染 Info Description 用的 type
export type IInfos = {
	tpId: number
	tpName: string
	selectedGameNames: string[]
}
