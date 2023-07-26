import { ISlotGameData } from 'common/service/allDataApi'
import { IInfos } from 'features/gameExclusion/type'

export interface IGetRebateExcludeGameListArgs {
	siteId?: number
	currencyId: number
}

export interface IRebateExcludeGameData {
	tpId: number
	tpName: string
	gameType: number
	gameTypeName: string
	categoryId: number
	categoryName: string
	gameId: string
	gameName: string
	appId: string
}

export type IExcludeGameData = {
	tpId: number
	gameType: number
	categoryId: number
	gameId: string
	appId: string
}

export interface ISetRebateExcludeGameArgs {
	siteId?: number
	currencyId: number
	excludeGameList: IExcludeGameData[]
}

// 渲染 games 下拉用自組的資料
export type ITpGameData = {
	tpId: number
	tpName: string
	tpGames: Omit<ISlotGameData, 'tpId'>[]
}

export type ISelectedGames = {
	[key: string]: {
		games: string[]
	}
}

export interface IEditForm {
	selectedTp: number[]
	selectedGames: ISelectedGames
}

// result table 用的 type
export interface IResultData extends IInfos {
	key: string
}
