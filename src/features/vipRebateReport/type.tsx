import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetListForVipArgs {
	siteIds: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	userName: string
	categoryIds: number[]
	baseCurrencyId: number
	payoutStatuses: number[]
	pageNumber: number
	pageSize: number
}

export interface IVipRebateInfoData {
	siteId: number
	siteName: string
	custId: number
	userName: string
	vipLevelName: string
	currencyId: number
	currency: string
	categoryId: number
	categoryName: string
	rcRedeemAmount: number
	createTime: string
	refId: string
	settledDate: number
	rcCalculatedAmount: number
	minPayout: number
	maxPayout: number
}
export interface IVipRebateCurrencyInfoData {
	currencyId: number
	currencyName: string
	totalAmount: number
	totalRecord: number
	siteName: string
}

export interface IGetListForVipData {
	currencyAmount: IVipRebateCurrencyInfoData[]
	vipRebateInfoList: IVipRebateInfoData[]
	totalPages?: number
	pageNumber?: number
	rowCount?: number
}

export type IGetListForVipResponse = IAxiosResponse<IGetListForVipData>

export interface IExportForVipArgs {
	siteIds: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	userName: string
	categoryIds: number[]
	baseCurrencyId: number
	payoutStatuses: number[]
}

export interface IGetVipRebateDetailArgs {
	custId: number
	tpCategoryId: number
	refId: string
}

export interface IGetVipRebateDetailData {
	gameType: number
	typeName: string
	validBet: number
	validTurnover: number
	percentage: number
	calculatedAmount: number
}

export type IGetVipRebateDetailResponse = IAxiosResponse<
	IGetVipRebateDetailData[]
>
