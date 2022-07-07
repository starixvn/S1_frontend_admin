import { UploadFile } from 'antd/es/upload/interface'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetCategoriesArgs {
	siteId?: number
	currencyId: number
	langCodes: string[]
}

export interface ICategoriesData {
	categoryId: number
	categoryName: string
	lang: string
}

export type ICategoriesResponse = IAxiosResponse<ICategoriesData[]>

export interface IGetGiftTagsArgs {
	siteId?: number
	currencyId: number
	langCodes: string[]
}

export interface IGiftTagsData {
	tagId: number
	tagName: string
	lang: string
}

export type IGiftTagsResponse = IAxiosResponse<IGiftTagsData[]>

export interface IGetGiftListArgs {
	siteId?: number
	currencyId: number
	status: number[]
	categoryIds: number[]
	tags: number[]
	giftName: string
}

export interface IGiftData {
	giftId: number
	giftName: string
	siteId: number
	siteName: string
	currencyId: number
	isoCode: string
	categoryId: number
	lang: string
	description: string
	pictureUrl: string | null
	status: number | boolean
	tags: {
		tagId: number
		tagName: string
		lang: string
	}[]
	point: number
	priceWorth: number
	showStock: number | boolean
	stock: number
	sort: number
	lastUpdater: string
	lastUpdateTime: string
}

export type IGiftListResponse = IAxiosResponse<IGiftData[]>

export interface IInfos {
	[lang: string]: {
		name: string
		description: string
	}
}

type IGiftId = number
export interface IUpdateGiftSortArgs {
	sortedIdList: IGiftId[]
}

export interface ICreateGiftArgs {
	siteId?: number
	currencyId: number
	status: number
	categoryId: number
	tags: number[]
	point: number
	priceWorth: number
	showStock: number | boolean
	stock: number
	sort: number
	infos: {
		lang: string
		name: string
		description: string
		pictureUrl: string
	}[]
}

export interface IGiftForm {
	status: number
	categoryId: number
	tags: number[]
	point: number
	priceWorth: number
	sort: number
	showStock: number | boolean
	stock: number
	fileList: UploadFile[]
	infos: IInfos
}

export interface IEditGiftForm extends IGiftForm {
	giftId: number
	pictureUrl: string
}

export interface IGetGiftInfoArgs {
	giftId: number
}

export interface IGiftInfoData {
	giftId: number
	giftName: string
	categoryId: number
	lang: string
	description: string
	pictureUrl: string
	showStock: number
	tagIds: number[]
	point: number
	priceWorth: number
	stock: number
	sort: number
	status: number
}

export type IGiftInfoResponse = IAxiosResponse<IGiftInfoData[]>

export interface IUpdateGiftArgs {
	giftId: number
	status: number | boolean
	categoryId: number
	tags: number[]
	point: number
	priceWorth: number
	showStock: number | boolean
	stock: number
	sort: number
	infos: {
		lang: string
		name: string
		description: string
		pictureUrl: string
	}[]
}
