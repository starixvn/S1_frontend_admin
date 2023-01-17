import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export type IFilterForm = {
	dateRange: [Moment, Moment]
	currencyIds: number[]
	memberId: string
}

export interface IGetBetLimitArgs {
	siteIds: number[]
	currencyIds: number[]
	userName: string | null
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export interface IBetLimitData {
	siteName: string
	siteId: number
	custId: number
	userName: string
	currencyId: number
	status: number
	creator: string
	createTime: string
	updateOperator: string
	updateTime: string
}

export type IBetLimitResponse = IAxiosResponse<IBetLimitData[]>

export interface IEditForm {
	userName: string | null
	custId?: number
	currencyId: number
}

export interface IGetByCustIdArgs {
	custId: number
}

export interface ILimitGroup {
	group: string
	range: string
}

export interface IGameTypeBetLimit {
	categoryId: number
	categoryName: string
	typeId: number
	typeName: string
	checked: boolean
	selectedValue?: string
	limitGroup: ILimitGroup[]
}

export interface IGetByCustIdData {
	siteId: number
	siteName: string
	custId: number
	userName: string
	currencyId: number
	gameTypeBetLimit: IGameTypeBetLimit[]
}

export type IGetByCustIdResponse = IAxiosResponse<IGetByCustIdData>

interface IBetSetting {
	tpCategory: number
	tpCategoryName: string
	gameTypeId: number
	gameTypeName: string
	limitGroup?: string | null
	imitRange?: string | null
}

export interface ISetBetLimitArgs {
	siteId?: number
	currencyId: number
	after: {
		userName: string | null
		betSetting?: IBetSetting[]
	}
}

export interface IDeleteBetLimitArgs {
	siteId?: number
	currencyId: number
	before: {
		custId: number
		userName: string
	}
}

export interface IGetCustDetailsArgs {
	userName?: string | null
	siteId?: number
}

export interface ICustInfoDetailsData {
	custId: number
	currencyId: number
}

export type ICustInfoDetailsResponse = IAxiosResponse<ICustInfoDetailsData>

export interface ITpCategoryListData {
	categoryId: number
}

export type ITpCategoryListResponse = IAxiosResponse<ITpCategoryListData>

export interface IGetTpBetLimitGroupArgs {
	categoryId: number
	currencyId: number
}

export type ITpBetLimitGroupResponse = IAxiosResponse<IGameTypeBetLimit[]>
