import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Dayjs } from 'dayjs'

export interface IGetBonusReportDataListArgs {
	siteIds?: number[]
	siteId?: number
	bonusCode: null | string
	promotionTypes: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	userName: null | string
	transId: null | string
	pageNumber: number
	pageSize: number
	baseCurrencyId: number
	promotionCategoryIds: number[]
	statuses: number[]
	atPages: number[]
}

export interface IBonusReportData {
	siteId: number
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
	categoryName: string
	atPage: string
}

export interface ICurrencyAmountRecord {
	siteName: string
	currency: string
	amount: number
	record: number
}

export interface IBonusReportResponse
	extends IAxiosResponse<IBonusReportData[]> {
	currencyAmountRecord: ICurrencyAmountRecord[]
}

export interface IExportBonusReportArgs {
	siteIds?: number[]
	siteId?: number
	bonusCode: null | string
	promotionTypes: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	userName: null | string
	transId: null | string
	pageNumber: number
	pageSize: number
	baseCurrencyId: number
	promotionCategoryIds: number[]
	statuses: number[]
	atPages: number[]
}

export interface IPromotionCategoryOptionData {
	promotionCategoryId: number
	promotionCategoryName: string
}

export type IPromotionCategoryOptionsResponse = IAxiosResponse<
	IPromotionCategoryOptionData[]
>

export interface IFilterForm {
	siteIds: number[]
	currencyIds: number[]
	baseCurrencyId: number
	promotionTypes: number[]
	statuses: number[]
	promotionCategoryIds: number[]
	userName: string
	transId: string
	bonusCode: string
	dateRange: [Dayjs, Dayjs]
	atPages: number[]
}
