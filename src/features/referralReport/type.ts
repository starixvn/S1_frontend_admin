import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IReferralReportArgs {
	pageNumber: number
	pageSize: number
	siteIds: number[]
	userName: string
	currencyId: number
	startDate: string
	endDate: string
}

export interface IReferralReportData {
	siteId: number
	siteName: string
	tpUserName: string
	custId: number
	userName: string
	currencyId: number
	currency: string
	referralCount: number
	conditionCount: number
	amountCount: number
	amountSum: number
	freeCreditSum: number
	pendingCount: number
	expiredCount: number
}

export type IGetReferralReportResponse = IAxiosResponse<IReferralReportData[]>

export interface IReferralCustReportArgs {
	pageNumber: number
	pageSize: number
	startDate: string
	endDate: string
	custID: number
}

export interface IReferralCustReportData {
	custId: number
	userName: string
	currencyId: number
	currency: string
	registerDate: string
	totalDeposit: number
	depositC: number
	totalBet: number
	validBetC: number
	bonusAmount: number
	referralFreeCredit: number
	rewardTime: string
	status: number
	statusName: string
}

export type IReferralCustReportResponse = IAxiosResponse<
	IReferralCustReportData[]
>

export interface IExportReferralReportArgs {
	siteIds: number[]
	userName: string
	currencyId: number
	startDate: string
	endDate: string
	timezone: number
}
