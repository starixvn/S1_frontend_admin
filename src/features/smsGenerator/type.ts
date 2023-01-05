import { UploadFile } from 'antd/es/upload/interface'

export interface IGetMessageListArgs {
	siteIds?: number
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export interface IMessageData {
	siteName: string
	siteId: number
	batchId: number
	author: string
	lastUpdateUser: string
	isPopup: boolean
	title: string
	content: string
	// Json
	message: string
	status: number
	updateTime: string
	createTime: string
}

export interface IGetMessageDetailArgs {
	batchId: number
}

export type IMessageDetailData = IMessageData

export type ILanguageData = {
	lang: string
	message: {
		title: string
		content: string
		popupMessage: string
	}
}

export interface IUpdateMessageArgs {
	batchId: number
	isPopup: boolean
	languageDatas: ILanguageData[]
}

export type IDeleteMessageArgs = IGetMessageDetailArgs

export type IExportMessageResultArgs = IGetMessageDetailArgs

export interface IEditForm {
	// 用 "Add" 表示新增
	batchId: number | 'Add'
	currencyId: number
	accountStatus: number
	isPopup: boolean
	method: number
	fileList: UploadFile[]
	messages: any
}

export interface ILangCodesData {
	iLangList: string[]
}

export interface IConvertJsonData {
	key: string
	Title: string
	Content: string
	PopupMessage: string
}
