import { Moment } from 'moment'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetAnnouncementListArgs {
	pageNumber: number
	pageSize: number
	siteIds: number[]
	statuses: number[]
	startDate: string
	endDate: string
}

export interface IGetAnnouncementByIdArgs {
	id: number
}

export interface IUpdateAnnouncementArgs {
	announcement: {
		id: number | 'Add'
		siteId: number | undefined
		subject: string
		content: string
		status: number
		isTest: number
		seq: number
	}
	startTime: string
	endTime: string
}

// 新增排除 announcement 裡 id 欄位
export type IAddAnnouncementArgs = Omit<
	IUpdateAnnouncementArgs,
	Exclude<keyof IUpdateAnnouncementArgs, 'id'>
>

export interface IDeleteAnnouncementArgs {
	id: number
}

export interface IAnnouncementListData {
	id: number
	siteId: number
	siteName: string
	startTime: string
	endTime: string
	subject: string | null
	content: string | null
	status: number
	statusName: string
	creator: string
	createTime: string
	lastUpdateTime: string
	lastUpdater: string | null
	isTest: number
	seq: number
}

export interface IAnnouncementByIdData {
	id: number
	siteId: number
	siteName: string
	startTime: string
	endTime: string
	subject: string
	content: string
	status: number
	statusName: string
	creator: string
	createTime: string
	lastUpdateTime: string
	lastUpdater: string | null
	isTest: number
	seq: number
}

export type IAnnouncementByIdResponse = IAxiosResponse<IAnnouncementByIdData>

export interface IFilterForm {
	siteId: number
	dateRange: [Moment, Moment]
	status: string
}

export interface IEditForm {
	id: number | 'Add'
	dateRange: [Moment, Moment]
	siteId: number
	subject: any
	content: any
	status: boolean
	isTest: boolean
	seq: number
}

export interface IConvertJsonData {
	key: string
	[key: string]: string
}

// subject、content 需求的格式 key為 langCode
export interface ILangCodeData {
	[key: string]: string
}
