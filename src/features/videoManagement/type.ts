import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetVideoListArgs {
	siteId: number
	currencyIds: number[]
	langIds: number[] | number | string
	pageNumber: number
	pageSize: number
}

export interface IGetVideoData {
	date: string
	siteId: number
	currencyId: number
	langId: string
	title: string
	link: string
	lastUpdateTime: string
	operator: string
}

export type IGetVideoListResponse = IAxiosResponse<IGetVideoData[]>

export interface IUpdateVideoArgs {
	siteId: number
	currencyId: number
	before: {
		langId: number
		title: string
		link: string
	}
	after: {
		langId: number
		title: string
		link: string
	}
}

export type IUpdateVideoResponse = IAxiosResponse<null>

export interface IFilterForm {
	currencyIds: number[]
	langIds: number[]
}

export interface ITableForm extends IGetVideoData {}
