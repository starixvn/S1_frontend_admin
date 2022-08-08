import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetSNSListArgs {
	siteId?: number
	currencyId: number
}

export interface ISNSData {
	id: number
	channelName: string
	title: string
	mainPageStatus: boolean
	contactPageStatus: boolean
	footerStatus: boolean
	appPageStatus: boolean
	linkType: boolean
	link: string
	androidLink: string
	iosLink: string
	lastUpdateUser: string
	lastUpdateTime: string
}

export type IGetSNSListResponse = IAxiosResponse<ISNSData[]>

export interface ISetSortArgs {
	siteId?: number
	currencyId: number
	langId: string
	sortIds: number[]
}

export interface ISetDataArgs {
	id: number
	channelName: string
	title: string
	mainPageStatus: boolean
	contactPageStatus: boolean
	footerStatus: boolean
	appPageStatus: boolean
	linkType: boolean
	link: string
	androidLink: string
	iosLink: string
}
