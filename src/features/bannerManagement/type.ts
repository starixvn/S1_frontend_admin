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
	tpId: number
	gameId: string
	urlRouter: null
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
	categoryId: number
	currency: null
	bannerType: number
	actionMode: number
	showStatus: number
	bonusCode: null
	tpId: number
	gameId: string
	urlRouter: number
	specific: {
		currencyId: number
		details: string
		status: number
	}[]
	sort: number
}

export type IGetBannerResponse = IAxiosResponse<IGetBannerData>

export interface ISetBannerArgs {
	siteId: number
	currencyId: number
	before: {
		actionMode?: number
		bannerName?: string
		bannerType?: number
		endTime?: string
		showStatus?: number
		siteId?: number
		sort?: number | null
		specific?: {
			currencyId?: number
			details?: string
			status?: number | null
		}[]
		startTime?: string
		tpId?: number
		urlRouter?: number
		bonusCode?: null
		categoryId?: number
		gameId?: string
	}
	after: {
		actionMode: number
		bannerName: string
		bannerType: number
		endTime: string
		showStatus: number
		siteId: number
		sort: number | null
		specific: {
			currencyId: number
			details: string
			status: number | null
		}[]
		startTime: string
		tpId: number
		urlRouter: number
		bonusCode: null
		categoryId: number
		gameId: string
	}
}

export type ISetBannerResponse = IAxiosResponse<null>

export interface IUpdateStatusArgs {
	siteId: number
	currencyId: number
	before: {
		status: number
		bannerName: string
	}
	after: {
		status: number
		bannerName: string
	}
}

export type IUpdateStatusResponse = IAxiosResponse<null>

export interface IDeleteBannerArgs {
	siteId: number
	currencyId: number
	before: {
		bannerName: string
	}
	after: {
		bannerName?: string
	}
}

export type IDeleteBannerResponse = IAxiosResponse<null>

export interface IGetTpBySiteAndCurrencyArgs {
	siteId?: number
	currencyId: number
}

export interface IGetTpBySiteAndCurrencyData {
	tpId: number
	tpName: string
}

export type IGetTpBySiteAndCurrencyResponse = IAxiosResponse<
	IGetTpBySiteAndCurrencyData[]
>

export interface IGetTpCategoryByTpIdArgs {
	tpId: number | string
}

export interface IGetTpCategoryByTpIdData {
	categoryId: number
	categoryName: string
}

export type IGetTpCategoryByTpIdResponse = IAxiosResponse<
	IGetTpCategoryByTpIdData[]
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

export interface IGetGameIdListArgs {
	tpId: number | string
	categoryId: number | string
}

export interface IGetGameIdListData {
	gameCasinoId: number
	tpId: number
	gameId: string
	name: string
}

export type IGetGameIdListResponse = IAxiosResponse<IGetGameIdListData[]>

export interface IFilterForm {
	bannerTypes: number[]
	statuses: number[]
	current?: number | undefined
	pageSize?: number | undefined
}

export interface IAddForm {
	bannerName: string
	bannerType: number | string
	categoryId: number | string
	actionMode: number | string
	showStatus: number | string
	dateRange: [Moment, Moment]
	bonusCode: null
	tpId: number | string
	gameId: number | string
	urlRouter: number
	currencyId: number
	specific: any
	filterTpId: number | string
	sort: number
}
