import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment/moment'

// DashBoard
export interface IGetPerformanceHighlightArgs {
	siteId: number
	currencyIds: number[]
	startDate: string
	endDate: string
	comparedStartDate: string
	comparedEndDate: string
	isCompared: boolean
	baseCurrencyId: number
}

export interface IPerformanceHighlightData {
	totalUsers: number
	totalDepositUsers: number
	depositUsers: number
	firstDepositCount: number
	depositUsersComparedRate?: number
	depositAmount: number
	firstDepositAmount: number
	depositAmountComparedRate?: number
	activeUsers: number
	activeUsersComparedRate?: number
	nru: number
	nruComparedRate?: number
	activeNRU: number
	activeNRUComparedRate?: number
	withdrawalUsers: number
	withdrawalAmount: number
	withdrawalAmountComparedRate?: number
	netCashAmount: number
	netCashAmountComparedRate?: number
	bonusAmountClaimed: number
	totalBonusClaimants: number
	bonusAmountClaimedComparedRate?: number
	churnRate: number
	churnComparedRate?: number
	retentionRate: number
	retentionComparedRate?: number
	noBetUsers: number
	hasBetUsers: number
	basedOnReportTotalUsers: number
}

export interface IExportPerformanceHighlightArgs {
	siteId: number
	currencyIds: number[]
	startDate: string
	endDate: string
	baseCurrencyId: number
}

export type IPerformanceHighlightResponse =
	IAxiosResponse<IPerformanceHighlightData>

export interface IFilterForm {
	siteIds: number[]
	dateRange: [Moment, Moment]
	isCompared: boolean
	periodTime: number
	compareDateRange: [Moment, Moment]
	currencyIds: number[]
	baseCurrencyId: number
}

// 包括 depositAmount 、 withdrawalAmount 、 NRU 、 bonusAmountClaimed
export interface IGetMarketingBaseArgs {
	siteId?: number
	startDate: string
	endDate: string
	comparedStartDate: string
	comparedEndDate: string
	currencyIds: number[]
	orderBy: boolean
	orderByProperty: string
	orderByDirection: number
	baseCurrencyId: number
}

// ----------- Deposit Amount Part

export type IGetMarketingDepositSignUpUrlSummaryArgs = IGetMarketingBaseArgs

export interface IGetMarketingDepositSignUpDetailArgs
	extends IGetMarketingBaseArgs {
	pageNumber: number
	pageSize: number
}

export interface IExportMarketingDepositArgs extends IGetMarketingBaseArgs {
	isCompared: boolean
}

export interface IMarketingDepositSummaryData {
	depositAmount: number
	compareDepositAmount: number
	changeRate: string
}

// 遞迴結構
export interface ISignUpData {
	signUpSource?: string
	signUpUrl?: string
	firstDepositAmount: number
	totalDepositAmount: number
	noOfPlayers: number
	children?: ISignUpData[] | null
}

export interface IMarketingDepositSignUpUrlSummaryData {
	signUpData: ISignUpData[]
	totalSummary: Omit<ISignUpData, 'signUpSource' | 'signUpUrl' | 'children'>
}

export interface IMarketingDepositSignUpDetailData {
	userName: string
	currencyName: string
	registeredDate: string
	signUpUrl: string
	affCode: string
	firstDepositAmount: number
	depositCount: number
	totalDepositAmount: number
}

export type IMarketingDepositSummaryResponse =
	IAxiosResponse<IMarketingDepositSummaryData>

export type IMarketingDepositSignUpUrlSummaryResponse =
	IAxiosResponse<IMarketingDepositSignUpUrlSummaryData>

export type IMarketingDepositSignUpDetailResponse = IAxiosResponse<
	IMarketingDepositSignUpDetailData[]
>

// -------- Withdrawal Amount Part

export interface IGetMarketingWithdrawalDetailArgs
	extends Omit<IGetMarketingBaseArgs, 'comparedStartDate' | 'comparedEndDate'> {
	pageNumber: number
	pageSize: number
}

export interface IExportMarketingWithdrawalArgs extends IGetMarketingBaseArgs {
	isCompared: boolean
}

export interface IMarketingWithdrawalSummaryData {
	withdrawalAmount: number
	compareWithdrawalAmount: number
	withdrawalUsers: number
	compareWithdrawalUsers: number
	withdrawalAmountChangeRate: string
	withdrawalUsersChangeRate: string
}

export interface IMarketingWithdrawalDetailData {
	userName: string
	currencyName: string
	registeredDate: string
	withdrawalCount: number
	withdrawalAmount: number
}

export type IMartingWithdrawalSummaryResponse =
	IAxiosResponse<IMarketingWithdrawalSummaryData>

export type IMarketingWithdrawalDetailResponse = IAxiosResponse<
	IMarketingWithdrawalDetailData[]
>

// ------------------- NRU

export type IGetMarketingNruReportArgs = Omit<
	IGetMarketingBaseArgs,
	'orderBy' | 'orderByProperty' | 'orderByDirection'
>

export type IGetMarketingNruBonusReportArgs = Omit<
	IGetMarketingBaseArgs,
	| 'orderBy'
	| 'orderByProperty'
	| 'orderByDirection'
	| 'isCompared'
	| 'comparedStartDate'
	| 'comparedEndDate'
>

export interface IGetMarketingNruBonusDetailReportArgs
	extends Omit<IGetMarketingBaseArgs, 'comparedStartDate' | 'comparedEndDate'> {
	pageSize: number
	pageNumber: number
}

export interface IExportMarketingNruReportArgs
	extends Omit<
		IGetMarketingBaseArgs,
		'orderBy' | 'orderByProperty' | 'orderByDirection'
	> {
	isCompared: boolean
}

// 遞迴結構
export interface ISignUpSumData {
	signUpSource: string
	newlyRegisterUsers: number
	depositUsers: number
	firstDepositAmount: number
	children?: ISignUpSumData[] | null
}

export interface IMarketingNruReportData {
	summaryData: {
		newlyRegisterUsers: number
		compareNewlyRegisterUsers: number
		changeRate: number
	}
	signUpDataSum: ISignUpSumData[]
	totalSignUpData: Omit<ISignUpSumData, 'children'> & {
		totalDepositAmount: number
	}
}

export interface IMarketingNruBonusReportData {
	bonusCode: string
	bonusName: string
	nruCount: number
	depositCount: number
	firstDeposit: number
	totalDeposit: number
}

export interface IMarketingNruBonusDetailReportData {
	bonusCode: string
	userName: string
	currency: string
	regTime: string
	signupUrl: string
	affCode: number
	isDeposit: boolean
	firstDeposit: number
	totalDeposit: number
}

export type IMarketingNruReportResponse =
	IAxiosResponse<IMarketingNruReportData>

export type IMarketingNruBonusReportResponse = IAxiosResponse<
	IMarketingNruBonusReportData[]
>

export type IMarketingNruBonusDetailReportResponse = IAxiosResponse<
	IMarketingNruBonusDetailReportData[]
>

// -------------- Bonus Amount Claimed

export interface IGetBonusAmountClaimedArgs
	extends Omit<
		IGetMarketingBaseArgs,
		'orderBy' | 'orderByProperty' | 'orderByDirection'
	> {
	isCompared: boolean
}

export type IGetBonusAmountClaimedDetailArgs = Omit<
	IGetMarketingBaseArgs,
	'comparedStartDate' | 'comparedEndDate'
>

export interface IExportBonusAmountClaimedArgs extends IGetMarketingBaseArgs {
	isCompared: boolean
}

// 遞迴結構
export interface IBonusAmountClaimedInfoData {
	siteId?: number
	currencyId?: number
	currency?: string
	bonusCode: string
	bonusName: string
	numberOfBonusUser: number
	bonusAmountClaim: number
	baseBonusAmountClaim: number
	children?: IBonusAmountClaimedInfoData[]
}

export interface IBonusAmountClaimedCurrencyData {
	currencyId: number
	currency: string
	bonusAmountClaim: number
	comparedBonusAmountClaim: number
	baseBonusAmountClaim: number
	changeRate: number
}

export interface IBonusAmountClaimedReportData {
	// 最上層 bonusAmountClaimed 的 Total
	groupByCurrency: IBonusAmountClaimedCurrencyData[]
	groupByCurrencySum: IBonusAmountClaimedCurrencyData
	groupByBonusCodeSum: IBonusAmountClaimedInfoData
	groupByBonusCode: {
		groupInfo: IBonusAmountClaimedInfoData
		children: IBonusAmountClaimedInfoData[]
	}[]
}

export interface IBonusAmountClaimedDetailReportData {
	siteId: number
	bonusCode: string
	custId: string
	userName: string
	currencyId: number
	currency: string
	registeredDate: string
	signupUrl: string
	affCode: number
	totalDeposit: number
	totalWithdrawal: number
	bonusAmountClaim: number
}

export type IBonusAmountClaimedReportResponse =
	IAxiosResponse<IBonusAmountClaimedReportData>

export type IBonusAmountClaimedDetailResponse = IAxiosResponse<
	IBonusAmountClaimedDetailReportData[]
>
