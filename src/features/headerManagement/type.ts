import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetHeaderSettingArgs {
	siteId?: number
	currencyId?: number
	lobbyCategoryId: number
}

export interface IHeaderSettingData {
	id: number
	siteId: number
	currencyId: number
	currency: string
	lobbyCategoryId: number
	lobbyCategory: string
	tpId: number
	tpName: string
	tpGameIdNo: number
	productName: string
	currencyGameName: string
	memo: string
	status: number
	sort: number
	updateTime: string
	updater: string
}

export interface ILobbyCategoryData {
	id: string
	name: string
}

export type IHeaderSettingResponse = IAxiosResponse<IHeaderSettingData[]>

export interface IUpdateSortArgs {
	id: number
	sort: number
}

export interface IUpdateHeaderStatusArgs {
	id: number
	status: number
}

export interface IFilterForm {
	currencyId: number
	lobbyCategoryId: number
}

export interface IFilterProductStatusModalForm {
	lobbyCategoryId: number
}

export enum IHeaderSettingEnum {
	False,
	True,
}
