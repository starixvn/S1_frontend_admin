import { Moment } from 'moment'

export interface IGetNewsListArgs {
	siteIds: number[]
	startDate: string
	endDate: string
	status: number[]
	pageNumber: number
	pageSize: number
}

export interface INewsData {
	newsId: number
	siteId: number
	title: string
	content: string
	imageURL: string
	status: number
	postTime: string
	createTime: string
	lastUpdateTime: string
	unixPostTime: number | null
	lastUpdateUser: string | null
	sort: number
}

export interface IGetNewsByIdArgs {
	newsId: number
}

export interface ISetNewsArgs {
	isAdd: boolean
	siteId?: number
	title: string
	content: string
	imageUrl: string
	status: number
	postTime: string
	sort: number
	newsId: number
}

export interface ISetNewsStatusArgs {
	newsId: number
	status: number
}

export type IFilterForm = {
	dateRange: [Moment, Moment]
	status: number[]
}

export interface IEditForm {
	newsId: number | 'Add'
	postTime: Moment
	sort: number
	status: boolean
	imageUrl: any
	title: any
	content: any
}
