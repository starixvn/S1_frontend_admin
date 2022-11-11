import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetTpListData {
	id: number
	tpName: string
}

export type IGetTpListResponse = IAxiosResponse<IGetTpListData[]>

export interface IGetTpGameTypeData {
	type: number
	typeName: string
	tpId: number
	categoryId: number
}

export type IGetTpGameTypeResponse = IAxiosResponse<IGetTpGameTypeData[]>

export interface IGetListArgs {
	siteId: number
	currencyIds: number[]
	tpIds: number[]
	categoryIds: number[]
	gameTypes: number[]
	pageSize: number
	pageNumber: number
}

export interface IGetListData {
	siteId: number
	currencyId: number
	currency: string
	tpId: number
	tpName: string
	categoryId: number
	categoryName: string
	gameType: number
	gameTypeName: string
	frequency: number
	status: number
	lastUpdateUser: string
	lastUpdateTime: string
}

export type IGetListResponse = IAxiosResponse<IGetListData[]>

export interface ISetSettingArgs {
	siteId: number
	currencyId: number
	tpId: number
	gameType: number
	frequency: number
	status: number
}

export interface IDelSettingArgs {
	siteId: number
	currencyId: number
	tpId: number
	gameType: number
}

export interface IFilterForm {
	currencyIds: number[]
	tpGameTypes: number[]
	tpIds: number[]
}

export interface IEditForm {
	frequency: number
}

export interface IAddForm {
	frequency: number
	tpGameType: number
	tpId: number
	currencyId: number
}
