import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetBonusReportDataListArgs {
	siteId: number
	bonusCode: null | string
	promotionType: number
	currencyId: number
	startDate: string
	endDate: string
	userName: null | string
	transId: null | string
	pageNumber: number
	pageSize: number
	baseCurrencyId: number
	promotionCategoryId: number
	statuses: number[]
}

export interface IBonusReportData {
	siteName: string
	custId: number
	transId: string
	promotionName: string
	bonusCode: string
	userName: string
	currencyName: string
	bonus: number
	maxBonus: number
	rollOver: number
	winOver: number
	lockedAmount: number
	bonusAmount: number
	expiryTime: string
	createTime: string
	statusName: string
	cancelBonusAmount: number
	expiredCancel: boolean
	operator: string
	depositInfo: string | null // * JSON | null
}

export interface ICurrencyAmountRecord {
	currency: string
	amount: number
	record: number
}

export interface IBonusReportResponse
	extends IAxiosResponse<IBonusReportData[]> {
	currencyAmountRecord: ICurrencyAmountRecord[]
}

export interface IExportBonusReportArgs {
	siteId: number
	bonusCode: null | string
	promotionType: number
	currencyId: number
	startDate: string
	endDate: string
	userName: null | string
	transId: null | string
	pageNumber: number
	pageSize: number
	baseCurrencyId: number
	promotionCategoryId: number
	statuses: number[]
}

export interface IPromotionCategoryOptionData {
	promotionCategoryId: number
	promotionCategoryName: string
}

export type IPromotionCategoryOptionsResponse = IAxiosResponse<
	IPromotionCategoryOptionData[]
>
