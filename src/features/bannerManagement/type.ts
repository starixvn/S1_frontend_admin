import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export interface IGetBannerListArgs {
	siteId: number
	currencyId: number
	bannerTypes: number[]
	statuses: number[]
	pageNumber: number
}

export interface IGetBannerListData {
	status: number
	lastUpdateTime: string
	lastUpdateUser: string
	startTime: string
	endTime: string
	siteId: number
	bannerName: string
	currency: string
	bannerType: number
	actionMode: number
	showStatus: number
	bonusCode: null
	matchId: number
	tpId: number
	gameId: string
	urlRouter: null
	sportBattleDateTime: null
	sportCategoryId: null
	sportLeaguesId: null
	sportTeamsId: null
	specific: null
	sort: number
}

export type IGetBannerListResponse = IAxiosResponse<IGetBannerListData[]>

export interface IGetBannerArgs {
	siteId: number
	currencyId: number
	bannerName: string
}

export interface IGetBannerData {
	startTime: string
	endTime: string
	siteId: number
	bannerName: string
	currency: null
	bannerType: number
	actionMode: number
	showStatus: number
	bonusCode: null
	matchId: number
	tpId: number
	gameId: string
	urlRouter: string
	specific: {
		currencyId: number
		details: string
		status: number
	}[]
	sort: number
}

export type IGetBannerResponse = IAxiosResponse<IGetBannerData>

export interface ISetBannerArgs {
	isAdd: boolean
	siteId: number
	bannerName: string
	bannerType: number
	actionMode: number
	showStatus: number
	startTime: string
	endTime: string
	bonusCode: null
	matchId: number | null
	tpId: number
	gameId: string
	urlRouter: string | null
	sportBattleDateTime: null
	sportCategoryId: null
	sportLeaguesId: null
	sportTeamsId: null
	specific: {
		currencyId: number
		details: string
		status: number | null
	}[]
	sort: number | null
}

export type ISetBannerResponse = IAxiosResponse<null>

export interface IUpdateStatusArgs {
	siteId: number
	status: number
	bannerName: string
}

export type IUpdateStatusResponse = IAxiosResponse<null>

export interface IDeleteBannerArgs extends IGetBannerArgs {}

export type IDeleteBannerResponse = IAxiosResponse<null>

export interface IGetTpListData {
	id: number
	tpName: string
}

export type IGetTpListResponse = IAxiosResponse<IGetTpListData[]>

export interface IGetGameCasinoByTpIdArgs {
	tpId: number | string
}

export interface IGetGameCasinoByTpIdData {
	gameCasinoId: number
	tpId: number
	gameId: string
	name: string
	cName: string
	checked: boolean
}

export type IGetGameCasinoByTpIdResponse = IAxiosResponse<
	IGetGameCasinoByTpIdData[]
>

export interface IGetTpListByCategoryArgs {
	categoryId: number | string
}

export interface IGetTpListByCategoryData {
	tpId: number
	tpName: string
}

export type IGetTpListByCategoryResponse = IAxiosResponse<
	IGetTpListByCategoryData[]
>

export interface IGetLanguageListArgs {
	siteId?: number
	currencyId: number
}

export type IGetLanguageListResponse = IAxiosResponse<string[]>

export interface IFilterForm {
	bannerTypes: number[]
	statuses: number[]
	current?: number | undefined
	pageSize?: number | undefined
}

export interface IAddForm {
	bannerName: string
	bannerType: number | string
	actionMode: number | string
	showStatus: number | string
	dateRange: [Moment, Moment]
	bonusCode: null
	tpId: number | string
	gameId: number | string
	urlRouter: string
	currencyId: number
	specific: any
	filterTpId: number | string
}
