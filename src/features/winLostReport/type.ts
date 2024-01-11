import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'

export interface IWinLossBasicExportArgs {
	siteIds: number
	starTime: string
	endTime: string
	tpCategorys: number[]
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
	includeTest: boolean
	memberTypes: UserTypeEnum[]
}

export interface IWinLossBasicArgs extends IWinLossBasicExportArgs {
	baseCurrencyId: number
}

export type IWinLossBasicData = {
	turnOver: number
	validTurnOver: number
	ggr: number
	playerWinLoss: number
	baPlayerWinLoss: number
	progressiveWin: number
	progressiveBet: number
	commission: number
	baCommission: number
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

export type IWinLossByDateResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByDateExportArgs extends IWinLossBasicExportArgs {}

export interface IGetWinLossByMonthArgs extends IWinLossBasicArgs {}

export type IWinLossByMonthResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByMonthExportArgs extends IWinLossBasicExportArgs {}

export interface IGetWinLossByTpGameTypeArgs extends IWinLossBasicArgs {}

export type IWinLossByTpGameTypeResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByTpGameTypeExportArgs
	extends IWinLossBasicExportArgs {}

export interface IGetWinLossByTpCategoryTypeArgs extends IWinLossBasicArgs {}

export type IWinLossByTpCategoryTypeResponse = IAxiosResponse<
	IWinLossTableData[]
>

export interface IGetWinLossByTpCategoryTypeExportArgs
	extends IWinLossBasicExportArgs {}

export interface IGetWinLossByPlayerArgs extends IWinLossBasicArgs {
	pageNumber: number
	pageSize: number
}

export type IWinLossByPlayerResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByPlayerExportArgs
	extends IWinLossBasicExportArgs {}

export interface IGetWinLossByPlayerDetailArgs {
	siteIds: number
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

export type IWinLossByPlayerDetailResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByCurrencyArgs extends IWinLossBasicArgs {}

export type IWinLossByCurrencyResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByCurrencyExportArgs
	extends IWinLossBasicExportArgs {}

export interface IGetWinLossByBrandArgs extends IWinLossBasicArgs {}

export type IWinLossByBrandResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByBrandExportArgs extends IWinLossBasicExportArgs {}

export interface IGetWinLossByAffiliateArgs extends IWinLossBasicArgs {
	affiliateAccount: string
	pageNumber: number
	pageSize: number
}

export type IWinLossByAffiliateResponse = IAxiosResponse<IWinLossTableData[]>

export interface IGetWinLossByAffiliateExportArgs
	extends IWinLossBasicExportArgs {
	affiliateAccount: string
}
