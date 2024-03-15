export interface IGetLeaderboardRankingBonusArgs {
	siteIds: number[]
}

export type IGetLeaderboardPointCalculationArgs =
	IGetLeaderboardRankingBonusArgs

export type IRankingData = {
	ranking: string
	minPoint: number
	bonus: number
}
export interface ILeaderboardRankingBonusData {
	siteId: number
	siteName: string
	currency: string
	currencyId: number
	data: IRankingData[]
}

export interface ILeaderboardPointCalculationData {
	siteId: number
	siteName: string
	currency: string
	currencyId: number
	sportTurnOver: number
	slotTurnOver: number
	liveCasinoTurnOver: number
	status: number
	updater: string
	updateTime: string
}

export type ILeaderboardRankingData = {
	ranking: string
	minPoint: number
	bonus: number
}
export interface ISetLeaderboardRankingBonusArgs {
	siteId: number
	currencyId: number
	before: ILeaderboardRankingData
	after: ILeaderboardRankingData
}

export type ILeaderboardPointData = {
	sportTurnOver: number
	slotTurnOver: number
	liveCasinoTurnOver: number
	status: number
}
export interface ISetLeaderboardPointCalculation {
	siteId: number
	currencyId: number
	before: ILeaderboardPointData
	after: ILeaderboardPointData
}

export interface IGetLeaderboardTagExcludeListArgs {
	siteId?: number
}

export interface ILeaderboardTagExcludeData {
	siteId: number
	tagExcludeList: string
	tagsExclude: number[]
	updater: string
	updateTime: string
}

export interface ISetLeaderboardTagExcludeArgs {
	siteId?: number
	before: {
		tagExcludeList: number[]
	}
	after: { tagExcludeList: number[] }
}
