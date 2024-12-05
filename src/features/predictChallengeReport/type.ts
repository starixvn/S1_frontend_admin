import { Dayjs } from 'dayjs'
import { IAxiosResponse } from '../../common/service/axiosBaseQuery'

export interface IGetPredictionChallengeReportArgs {
	siteId?: number
	currencyIds: number[]
	predictStatusList: number[]
	userName: string
	startTime: string
	endTime: string
}

export type IGetPredictionChallengeReportExportArgs = Omit<
	IGetPredictionChallengeReportArgs,
	''
>

export interface IPredictionChallengeReportData {
	bonusCode: string
	matchId: number
	homeScore: number
	awayScore: number
	battleTime: string
	homeTeamName: string
	awayTeamName: string
	result: boolean
	responseByCurrency: IResponseByCurrency[]
}

export interface IResponseByCurrency {
	currency: string
	currencyId: number
	responseByUsers: Array<{
		userName: string
		bonus: number
		predictTime: string
		custHomeScore: number
		custAwayScore: number
		predictStatus: number
		isPayout: boolean
		depositCount: number
		depositAmount: number
		custId: number
	}>
}

export type IPredictionChallengeReportResponse = IAxiosResponse<
	IPredictionChallengeReportData[]
>

// Transformed Output Types
export interface IResponseByUsersChild {
	key: string
	userName: string
	bonus: number
	predictTime: string
	custHomeScore: number
	custAwayScore: number
	predictStatus: number
	isPayout: boolean
	depositCount: number
	depositAmount: number
	currencyId: number
	custId: number
	// 用於 ClaimPredictPromotion api ，因 bonusCode 欄位會被第二層(currency)顯示不同值而影響
	bonusCodeByClaim: string
}

export interface IResponseByCurrencyChild {
	key: string
	bonusCode: string
	userName: string
	bonus: number
	predictTime: string
	custHomeScore: number
	custAwayScore: number
	predictStatus: number
	isPayout: boolean
	depositCount: number
	depositAmount: number
	currencyId: number
	custId: number
	// 用於 ClaimPredictPromotion api ，因 bonusCode 欄位會被第二層(currency)顯示不同值而影響
	bonusCodeByClaim: string
	children?: IResponseByUsersChild[]
}

export interface IPredictionChallengeReportTransformedData {
	key: string
	bonusCode: string
	matchId: number
	homeScore: number
	awayScore: number
	battleTime: string
	homeTeamName: string
	awayTeamName: string
	result: boolean
	// 樹狀圖 child 需要的參數，在 utils convert 時不加這兩參數到第一層
	custAwayScore?: number
	custHomeScore?: number
	isPayout?: boolean
	custId?: number
	currencyId?: number
	bonusCodeByClaim?: string
	predictStatus?: number
	children?: IResponseByCurrencyChild[]
}

export interface IClaimPredictPromotionArgs {
	bonusCode: string
	matchId: number
	custIdList: number[]
	currencyId?: number
}

export interface IFilterForm {
	currencyIds: number[]
	predictStatusList: number[]
	userName: string
	dateRange: [Dayjs, Dayjs]
}
