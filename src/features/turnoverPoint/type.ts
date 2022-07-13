import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetTurnoverPointSettingListArgs {
	siteId?: number
	currencyId?: number
}

export interface IGetTurnoverPointSettingListData {
	vipLevel: number
	vipLevelName: string
	tpCategoryTurnoverPointSetting: CategoryTurnoverPointSetting[]
}

export type CategoryTurnoverPointSetting = {
	tpCategoryId: number
	turnover: number
	pointRate: number
	promotionStatus: number
	promotionPointRate: number
	promotionStartTime: string
	promotionEndTime: string
}

export type IGetTurnoverPointSettingListResponse = IAxiosResponse<
	IGetTurnoverPointSettingListData[]
>

export interface IGetTurnoverPointSettingArgs {
	siteId?: number
	currencyId?: number
	vipLevel: number
}

export interface IGetTurnoverPointSettingData {
	tpCategoryId: number
	tpCategoryName: string
	turnover: number
	pointRate: number
	promotionStatus: number
	promotionPointRate: number
	promotionStartTime: string
	promotionEndTime: string
	lastUpdater: string
	lastUpdateTime: string
}
export type IGetTurnoverPointSettingResponse = IAxiosResponse<
	IGetTurnoverPointSettingData[]
>

export interface ISetTurnoverPointSettingArgs {
	siteId?: number
	currencyId?: number
	infos: ISetTurnoverPointSettingInfo[]
}

export interface ISetTurnoverPointSettingInfo {
	tpCategoryId: number
	tpCategoryName: string
	turnover: number
	pointRate: number
	promotionStatus: number
	promotionPointRate: number
	promotionStartTime: string | null
	promotionEndTime: string | null
	vipLevel: number
}

export interface IGetTurnoverPointStatusSettingArgs {
	siteId?: number
	currencyId?: number
	tpCategoryId: number
}

export interface IGetTurnoverPointStatusSettingData {
	tpGameTypeId: number
	tpGameTypeName: string
	status: number
	lastUpdater?: string
	lastUpdateTime?: string
}

export interface IGetTpGameTypeArg {
	categoryId: number
}

export interface IGetTpGameTypeData {
	tpId: number
	type: number
	typeName: string
	categoryId: number
	categoryName: null
}

export type IGetTpGameTypeResponse = IAxiosResponse<IGetTpGameTypeData[]>

export type IGetTurnoverPointStatusSettingResponse = IAxiosResponse<
	IGetTurnoverPointStatusSettingData[]
>

export interface ISetTurnoverPointStatusSettingArgs {
	siteId?: number
	currencyId?: number
	tpCategoryId?: number
	infos: ISetTurnoverPointStatusSettingInfo[]
}

export interface ISetTurnoverPointStatusSettingInfo {
	tpGameTypeId: number
	status: number
}

export interface IGetTpCategoryArg {
	siteId?: number
}
export interface IGetTpCategoryData {
	categoryId: number
	categoryName: string
}

export type IGetTpCategoryResponse = IAxiosResponse<IGetTpCategoryData[]>
