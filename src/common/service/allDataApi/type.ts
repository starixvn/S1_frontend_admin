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
	checked: boolean
	gameTypeBetLimit: string
}
export type IGetCategoryResponse = IAxiosResponse<IGetCategoryData[]>

export interface IGetProductsData {
	type: number
	typeName: string
	tpId: number
	categoryId: number
	tpIdStatus?: number
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

export interface IGateWayArgs {
	siteId?: number
}

export interface IGateWayData {
	payId: number
	payName: string
	status: number
	loginUrl: string
	loginAccount: string
	loginPassword: string
	transferPin: string
	loginPin: string
}

// LangCodes Data
export interface ILangCodesData {
	iLangList: string[]
}

export interface ITpListData {
	id: number
	tpName: string
	tpDisplayName: string
}

export interface IGetPaySettingData {
	currencyId: number
	payId: number
	payName: string
	channelId: number
	channelName: string
	groupName: null
	type: number
	mode: number
	minAmount: number
	maxAmount: number
	amountRule: number
	fixedAmountList: number[]
	pointLevel: number
	sort: number
	status: number
	globalstatus: number
	method: number
	chargeFeePercentage: number
	chargeFeePreCount: number
	isoCode: string
}

export type IGetPaySettingListResponse = IAxiosResponse<IGetPaySettingData[]>

export interface IGetTpIdData {
	id: number
	tpName: string
}

export interface ISlotTpData {
	tpId: number
	tpName: string
	gameList: null
	checked: boolean
}

export interface ISlotGameData {
	tpId: number
	gameType: number
	categoryId: number
	id: string
	gameId: string
	appId: string
	name: string
}

export type ILocalPaySettingData = {
	currencyId: number
	sysId: number
	groupId: number
	groupName: string
	type: number
}
