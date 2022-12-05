import { IAxiosResponse } from '../axiosBaseQuery'

export interface IVipLevelsData {
	siteId: number
	level: number
	levelName: string
	fixed: number
	createTime: string
	updateTime: string
}

export type IVipLevelsResponse = IAxiosResponse<IVipLevelsData[]>

export interface IBankInfoSysData {
	bankCode: string
	bankLogo: string
	bankName: string
	bankSite: string
	currencyId: number
	sysId: number
}

export type IBankInfoSysResponse = IAxiosResponse<IBankInfoSysData[]>

export interface IGetCategoryData {
	categoryId: number
	categoryName: string
}
export type IGetCategoryResponse = IAxiosResponse<IGetCategoryData[]>

export interface IGetProductsData {
	type: number
	typeName: string
	tpId: number
	categoryId: number
}

export type IGetProductsResponse = IAxiosResponse<IGetProductsData[]>

export interface IGetPromotionTypeData {
	type: number
	promotionTypeName: string
}

export type IGetPromotionTypeResponse = IAxiosResponse<IGetPromotionTypeData[]>

export interface IGetPayEnumData {
	payId: number
	payName: string
	payStatus: number
	sitePayStatus: number
	status: number
}

export type IGetPayEnumListResponse = IAxiosResponse<IGetPayEnumData[]>
