import { Moment } from 'moment'

export interface IGetBonusInfoArgs {
	siteId?: number
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
	isGroupByDate: boolean
}

export type IExportBonusInfoArgs = Omit<
	IGetBonusInfoArgs,
	'pageSize' | 'pageNumber'
>

export interface IBonusInfoData {
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
	dateRange: [Moment, Moment]
	bonusCode: string
	bonusTypes: number[]
	bonusStatus: number[]
	claimStatuses: number[]
	currencyIds: number[]
	baseCurrencyId: number
	groupBy: number
	orderBy: boolean
	orderByProperty: string
	orderByDirection: number
}

export interface IBonusDetailForm {
	bonusCode: string
	orderByProperty: string
	orderByDirection: number
}
