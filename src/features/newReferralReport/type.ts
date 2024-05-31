import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Dayjs } from 'dayjs'

export interface IGetListArgs {
	siteIds: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	userName: string | null
	pageSize: number
	pageNumber: number
}

export interface IListData {
	siteName: string
	currencyId: number
	currency: string
	custId: number
	userName: string
	totalReferee: number
	totalDeposit: number
	payoutAmount: number
	referralAmount: number
}

export type IDepositReferralReportResponse = IAxiosResponse<IListData[]>

export interface IExportDepositReferralReportArgs {
	siteIds: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	userName: string | null
}

export interface IGetDetailByCustIdArgs {
	custId: number
	startDate: string
	endDate: string
}

export interface IDetailByCustIdData {
	depositDate: string
	custId: number
	userName: string
	totalDeposit: number
	rewardPercentage: number
	referralAmount: number
}

export type IDetailByCustIdResponse = IAxiosResponse<IDetailByCustIdData[]>

export interface IFilterForm {
	currencyIds: number[]
	dateRange: [Dayjs, Dayjs]
	userName: string | null
}
