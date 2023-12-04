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

export interface ISetLeaderboardRankingBonusArgs {
	siteId: number
	currencyId: number
	ranking: string
	minPoint: number
	bonus: number
}

export interface ISetLeaderboardPointCalculation {
	siteId: number
	currencyId: number
	sportTurnOver: number
	slotTurnOver: number
	liveCasinoTurnOver: number
	status: number
}
