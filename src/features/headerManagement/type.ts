import dayjs from 'dayjs'
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

export interface IGetHeaderSettingGroupByTpGameIdNoArgs {
	siteId?: number
	lobbyCategoryId: number
}

export interface IHeaderSettingGroupByTpGameIdNoData {
	siteId: number
	lobbyCategory: string
	productName: string
	tpGameIdNo: number
	status: number
	iconType: number
	iconStartTime: string
	iconEndTime: string
}

export type HeaderSettingGroupByTpGameIdNoResponse = IAxiosResponse<
	IHeaderSettingGroupByTpGameIdNoData[]
>

export interface IUpdateHeaderSettingByTpGameIdArgs {
	siteId?: number
	tpGameIdNo: number
	status: number
	iconType: number
	iconStartTime: string
	iconEndTime: string
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

export interface IUpdateHeaderSettingEnvironmentArgs {
	siteId?: number
	tpGameIdNo: number
	isPRD: number
}

export interface IFilterProductStatusModalForm {
	lobbyCategoryId: number
}

export enum IHeaderSettingEnum {
	False,
	True,
}

export enum IHeaderSettingRlsToPrdArgsEnum {
	False,
	True,
}

export enum IHeaderSettingRlsToPrdEnum {
	Release = 1,
	Production = 3,
}

export interface IFilterForm {
	currencyId: number
	lobbyCategoryId: number
}

export interface IEditProductStatusForm {
	dateRange: [dayjs.Dayjs, dayjs.Dayjs]
	status: boolean
	iconType: number
}
