import { IAxiosResponse } from '../../common/service/axiosBaseQuery'

export interface IGetPeriodArgs {
	siteId?: number
}

export type IGetPeriodData = {
	periodType: number
	periodDay: number
	redeemHours: number
}
export type IGetPeriodResponse = IAxiosResponse<IGetPeriodData>

export interface ISetPeriodArgs {
	siteId?: number
	periodType: number
	periodDay: number
	redeemHours: number
}

export interface IGetRebateInfoArgs {
	siteId?: number
	currencyId: number
}

export interface IGetRebateInfoData {
	currencyId: number
	payoutLimitList: IPayoutLimitListData[]
	categoryDataList: ICategoryData[]
}

export type IGetRebateInfoResponse = IAxiosResponse<IGetRebateInfoData>

export type IPayoutLimitListData = {
	categoryId: number
	maxPayout: number
	minPayout: number
}

export type IRebateTableData = {
	categoryId: number
	categoryName: string
	vintageClub: number | null
	silverClub: number | null
	goldClub: number | null
	titaniumClub: number | null
	diamondClub: number | null
	novaClub: number | null
	maxPayout: number | null
	minPayout: number | null
}

export type ICategoryData = {
	categoryId: number
	categoryName: string
	categoryLevelList: ICategoryLevelData[]
}

export type ICategoryLevelData = {
	level: number
	percentage: number
}

export enum GameLevelsEnum {
	VintageClub = 1,
	SilverClub,
	GoldClub,
	TitaniumClub,
	DiamondClub,
	NovaClub,
}

export interface IGetRebateGameTypeListArgs {
	siteId?: number
	currencyId: number
	rebateCategoryId: number
}

export type IGetRebateGameTypeListResponse = IAxiosResponse<IGameRebateData[]>

export type IGameRebateData = {
	gameType: number
	gameTypeName: string
	level: number
	percentage: number
}

export type IGameRebateTableData = {
	gameType: number
	gameTypeName?: string
	vintageClub?: number | null
	silverClub?: number | null
	goldClub?: number | null
	titaniumClub?: number | null
	diamondClub?: number | null
	novaClub?: number | null
}

export interface ISetCategoryArgs {
	siteId?: number
	currencyId: number
	categoryId: number
	level: number
	percentage: number
}

export interface ISetBatchGameTypeArgs {
	siteId?: number
	currencyId: number
	detail: GameRebateEditData[]
}

export type GameRebateEditData = {
	gameType: number
	gameTypeName: string
	level: number
	percentage: number | null
}

export interface ISetPayoutLimitArgs {
	siteId?: number
	currencyId: number
	categoryId: number
	maxPayout: number
	minPayout: number
}

export const ErrorTypesLabel = {
	0: 'GameLevel.Label_VintageClub',
	1: 'GameLevel.Label_SilverClub',
	2: 'GameLevel.Label_GoldClub',
	3: 'GameLevel.Label_TitaniumClub',
	4: 'GameLevel.Label_DiamondClub',
	5: 'GameLevel.Label_NovaClub',
	6: 'Label_PayoutLimit',
}
