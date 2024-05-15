import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Dayjs } from 'dayjs'

export interface IGetConfiscatedListArgs {
	siteIds: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	baseCurrencyId: number
	userName: string | null
	pageNumber: number
	pageSize: number
}

export interface IConfiscatedData {
	suspendDate: string
	custId: number
	currencyId: number
	userName: string
	sabaId: string
	currency: string
	registrationDate: string
	levelName: string
	seamlessWallet: number
	totalDeposit: number
	totalWithdrawal: number
	netDeposit: number
	netConfiscatedCash: number
}

export type IConfiscatedResponse = IAxiosResponse<IConfiscatedData[]>

export type IGetConfiscatedSummaryArgs = Omit<
	IGetConfiscatedListArgs,
	'pageNumber' | 'pageSize' | 'startDate' | 'endDate'
>

export interface IConfiscatedSummaryData {
	totalUser: number
	totalSeamlessWallet: number
	totalDeposit: number
	totalWithdrawal: number
	totalNetDeposit: number
	totalNetConfiscatedCash: number
}

export type IConfiscatedSummaryResponse =
	IAxiosResponse<IConfiscatedSummaryData>

export type IExportConfiscatedArgs = Omit<
	IGetConfiscatedListArgs,
	'pageNumber' | 'pageSize'
>

export interface IFilterForm {
	dateRange: [Dayjs, Dayjs]
	currencyIds: number[]
	baseCurrencyId: number
	userName: string
}
