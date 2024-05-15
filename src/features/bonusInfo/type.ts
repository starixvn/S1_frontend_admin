import { Dayjs } from 'dayjs'

export interface IGetBonusInfoArgs {
	siteId?: number
	siteIds?: number[]
	bonusCode: string
	bonusTypes: number[]
	bonusStatus: number[]
	startDate: string
	endDate: string
	claimStatuses: number[]
	currencyIds: number[]
	baseCurrencyId: number
	pageSize: number
	pageNumber: number
	orderBy: boolean
	orderByProperty: string
	orderByDirection: number
	groupByType: number
}

export type IExportBonusInfoArgs = Omit<
	IGetBonusInfoArgs,
	'pageSize' | 'pageNumber'
>

export interface IBonusInfoData {
	siteId: number
	siteName: string
	recordDate: string
	bonusName: string
	bonusCode: string
	bonusType: number
	typeName: string
	startTime: string
	endTime: string
	bonusStatus: number
	ggr: number
	runningCount: number
	cancelCount: number
	fulFillCount: number
	otherPlatformCount: number
	totalClaimants: number
	totalClaimedAmount: number
	totalDeposit: number
	totalWithdrawal: number
}

export interface IGetBonusDetailListArgs {
	siteId?: number
	bonusCode: string
	startDate: string
	endDate: string
	claimStatuses: number[]
	currencyIds: number[]
	baseCurrencyId: number
	pageSize: number
	pageNumber: number
	orderBy: boolean
	orderByProperty: string
	orderByDirection: number
}

export type IExportBonusDetailListArgs = Omit<
	IGetBonusDetailListArgs,
	'pageNumber' | 'pageSize'
>

export interface IBonusDetailListData {
	userName: string
	bonusCode: string
	claimDate: string
	bonusAmountClaim: number
	transactionType: number
	claimStatus: number
	completion: number
	totalWithdrawal: number
	totalDeposit: number
}

export interface IFilterForm {
	dateRange: [Dayjs, Dayjs]
	siteIds: number[]
	bonusCode: string
	bonusTypes: number[]
	bonusStatus: number[]
	claimStatuses: number[]
	currencyIds: number[]
	baseCurrencyId: number
	groupByType: number
	orderBy: boolean
	orderByProperty: string
	orderByDirection: number
}

export interface IBonusDetailForm {
	dateRange: [Dayjs, Dayjs]
	recordSiteId: number
	bonusCode: string
	bonusSelector: string
	orderByProperty: string
	orderByDirection: number
	recordDate: string
}

export interface IBonusDetailOptions {
	bonusCode: string
	siteId: number
	siteName: string
}
