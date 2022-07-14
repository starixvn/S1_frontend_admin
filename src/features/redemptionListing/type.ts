import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetRedemptionListArgs {
	siteId?: number
	currencyIds: number[]
	vipLevels: number[]
	statuses: number[]
	transId: string
	userName: string
	sabaId: string
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export interface IExportRedemptionListArgs {
	siteId?: number
	currencyIds: number[]
	vipLevels: number[]
	statuses: number[]
	transId: string
	userName: string
	sabaId: string
	startTime: string
	endTime: string
}

export interface IGetRedemptionListData {
	siteId: number
	isoCode: string
	redemptionId: number
	transId: string
	status: number
	createTime: string
	updateTime: string
	userName: string
	sabaId: string
	vipLevel: number
	vipLevelName: string
	itemName: string
	point: number
	actualCost: number
	operator: string | null
}

export interface IGetRedemptionOverviewData {
	currencyId: number
	isoCode: string
	totalPoint: number
	totalCost: number
	totalRecord: number
}

type IRedemptionListData = {
	overview: IGetRedemptionOverviewData[]
	list: {
		pageNumber: number
		totalPages: number
		rowCount: number
		datas: IGetRedemptionListData[]
	}
}

export type IGetRedemptionListResponse = IAxiosResponse<IRedemptionListData>

export interface IGetRedemptionDetailArg {
	redemptionId: number
}

export interface IGetRedemptionDetailData {
	siteId: number
	currencyId: number
	userName: string
	pointBalance: number
	redemptionId: number
	transId: string
	itemId: number
	itemName: string
	redeemPoint: number
	priceWorth: number
	actualCost: number
	areaCode: string
	phoneNo: string
	city: string
	state: string
	country: string
	postCode: string
	lineFirst: string
	lineSecond: string
	accountName: string
	status: number
	receiptUrls: string[] | null
}

export type IGetRedemptionDetailResponse =
	IAxiosResponse<IGetRedemptionDetailData>

export interface IGetVipLevelsData {
	siteId: number
	level: number
	levelName: string
	fixed: number
	createTime: string
	updateTime: string
}

export type IGetVipLevelsResponse = IAxiosResponse<IGetVipLevelsData[]>

export interface IGetRedemptionLogArgs {
	transId: string
}

export interface IGetRedemptionLogData {
	action: number
	comment: string
	operator: string
	createTime: string
}

export type IGetRedemptionLogResponse = IAxiosResponse<IGetRedemptionLogData[]>

export interface ISetRedemptionInfoArgs {
	siteId?: number
	transId: string
	action: number
	comment: string
	actualCost: number
	receiptUrls: string[]
}
