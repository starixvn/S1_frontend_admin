import { Dayjs } from 'dayjs'
import { UploadFile } from 'antd/es/upload/interface'

export interface IGetLeaderboardExtraPointArgs {
	siteId: number
	currencyIds: number[]
	categoryIds: number[]
	startDate: string
	endDate: string
	pageSize: number
	pageNumber: number
}

export type IExportLeaderboardExtraPointArgs = Omit<
	IGetLeaderboardExtraPointArgs,
	'pageSize' | 'pageNumber'
>

export interface ILeaderboardExtraPointData {
	activeDate: string
	custId: number
	userName: string
	currency: string
	categoryName: string
	extraPoint: number
	createTime: string
	updateTime: string
	lastUpdateUser: string
}

export interface IExtraPointData {
	errorCode: number
	message: string
	rawErrorCode: string
	rawMessage: string
}

export type IExtraPointResponse = IExtraPointData[]

export interface IFilterForm {
	dateRange: [Dayjs, Dayjs]
	currencyIds: number[]
	categoryIds: number[]
}

export interface IAddForm {
	fileList: UploadFile[]
}

export interface ILeaderBoardCategoryEnumData {
	name: string
	value: number
}
