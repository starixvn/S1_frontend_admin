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
	limitInput: any
}

export interface IGetByCustIdArgs {
	custId: number | undefined
}

export interface ILimitGroup {
	group: string
	range: string
}

export interface ILimitInput {
	min: number | undefined | null
	max: number | undefined | null
	maxPerMatch: number | undefined | null
}

export interface IGameTypeBetLimit {
	tpCategory: number
	tpCategoryName: string
	gameTypeId: number
	gameTypeName: string
	checked: boolean
	limitGroup?: string | null
	limitRange?: string | null
	min?: number | null
	max?: number | null
	maxPerMatch?: number | null
}

export interface IGetByCustIdData {
	custId: number
	userName: string
	currencyId: number
	betSetting: IGameTypeBetLimit[]
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

export interface IGetTpCategoryListArgs {
	siteId?: number
	currencyId: number
}

export interface ITpCategoryListData {
	checked: boolean
	selectedGroup: string
	categoryId: number
	categoryName: string
	gameType: number
	gameTypeName: string
	isGroup: boolean
	limitGroup: ILimitGroup[]
	limitInput: ILimitInput
	defaultGroup: string
}

export interface IBetLimitTableData {
	tpCategoryName: string
	tpCategory: number
	checked: boolean
	gameTypeId: number
	gameTypeName: string
	limitGroupOptions: ILimitGroup[] | undefined
	limitGroup?: string | undefined | null
	isGroup: boolean
	limitInput?: ILimitInput
}

export interface IFormBetLimitTableData {
	[key: string]: IBetLimitTableData
}

export type ITpCategoryListResponse = IAxiosResponse<ITpCategoryListData[]>
