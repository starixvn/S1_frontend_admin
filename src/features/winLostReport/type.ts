import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IWinLossBasicExportArgs {
	siteId: number
	starTime: string
	endTime: string
	tpGameTypes: number[]
	currencyIds: number[]
	userName: string
	orderBy: boolean
	orderByProperty: string
	orderByDirection: number
	dateType: number
	displayGroupBreakdownInOriginalCurrency: boolean
	includeFreeSpins: boolean
	noDraw: boolean
}

export interface IWinLossBasicArgs extends IWinLossBasicExportArgs {
	baseCurrencyId: number
}

export type IWinLossBasicData = {
	turnOver: number
	validTurnOver: number
	ggr: number
	playerWinLoss: number
	progressiveWin: number
	progressiveBet: number
	commission: number
	betCount: number
	avgBetAmount: number
	uniquePlayers: number
	margin: number
	depositCount?: number
	totalDepositAmount?: number
	withDrawCount?: number
	totalWithDrawAmount?: number
	totalBonus?: number
	key?: number
}

export interface IWinLossTableData extends IWinLossBasicData {
	displayKey: string
	children?: IWinLossTableData[]
	data?: IWinLossBasicData
}

export interface IGetWinLossByDateArgs extends IWinLossBasicArgs {}

export type IGetWinLossByDateResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByDateExportArgs extends IWinLossBasicExportArgs {}

export interface IGetWinLossByMonthArgs extends IWinLossBasicArgs {}

export type IGetWinLossByMonthResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByMonthExportArgs extends IWinLossBasicExportArgs {}

export interface IGetWinLossByTpGameTypeArgs extends IWinLossBasicArgs {}

export type IGetWinLossByTpGameTypeResponse = IAxiosResponse<
	IWinLossTableData[]
>

export interface IGetWinLossByTpGameTypeExportArgs
	extends IWinLossBasicExportArgs {}

export interface IGetWinLossByTpCategoryTypeArgs extends IWinLossBasicArgs {}

export type IGetWinLossByTpCategoryTypeResponse = IAxiosResponse<
	IWinLossTableData[]
>

export interface IGetWinLossByTpCategoryTypeExportArgs
	extends IWinLossBasicExportArgs {}

export interface IGetWinLossByPlayerArgs extends IWinLossBasicArgs {
	pageNumber: number
	pageSize: number
}

export type IGetWinLossByPlayerResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByPlayerExportArgs
	extends IWinLossBasicExportArgs {}

export interface IGetWinLossByPlayerDetailArgs {
	siteId: number
	starTime: string
	endTime: string
	tpGameTypes: number[]
	currencyIds: number[]
	userName: string
	orderBy: boolean
	orderByProperty: string
	orderByDirection: number
	dateType: number
	displayGroupBreakdownInOriginalCurrency: boolean
	baseCurrencyId: number
}

export type IGetWinLossByPlayerDetailResponse = IAxiosResponse<
	IWinLossTableData[]
>

export interface IGetWinLossByCurrencyArgs extends IWinLossBasicArgs {}

export type IGetWinLossByCurrencyResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByCurrencyExportArgs
	extends IWinLossBasicExportArgs {}
