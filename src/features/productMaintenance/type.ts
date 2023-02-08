import { Moment } from 'moment'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetTpGameTypeArgs {
	tpId: number
}

export interface IGetTpMaintenanceArgs {
	siteId: number[]
	startDate: string
	endDate: string
	tpId: number
	tpGameTypeId: number
	tpCategoryId: number
	isExpired: boolean
	pageSize: number
	pageNumber: number
}

export interface IAddTpMaintenanceArgs {
	sn: string
	siteId: number
	tpId: string
	tpGameTypeList: string
	beginDate: string
	endDate: string
	maintainType: string
}

export interface IUpdateTpMaintenanceArgs {
	sn: string
	beginDate: string
	endDate: string
}

export interface IDeleteTpMaintenanceArgs {
	sn: number
}

export interface ITpMaintenanceData {
	sn: number
	siteId: number
	siteName: string
	tpId: number
	tpName: string
	tpGameType: number
	tpGameTypeList: null | string
	typeName: string
	tpCategoryId: number
	categoryName: string
	beginDate: string
	endDate: string
	maintainType: string
	typeValue: number
	beginTime: string
	endTime: string
	updateUser: string
	updateTime: string
}

export interface ITpGameTypeData {
	type: number
	typeName: string
	tpId: number
	categoryId: number
}

export type ITpGameTypeResponse = IAxiosResponse<ITpGameTypeData[]>

export type ITpMaintenanceResponse = IAxiosResponse<ITpMaintenanceData[]>

export interface IFilterForm {
	dateRange: [Moment, Moment]
	tpId: number
	tpGameTypeId: number
	tpCategoryId: number
	isExpired: boolean
}

export interface IEditForm {
	dateRange: [Moment, Moment]
}

export interface IAddForm {
	dateRange: [Moment, Moment]
	tpId: number
	tpGameType: string[]
}
