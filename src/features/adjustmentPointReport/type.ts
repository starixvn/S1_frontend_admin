import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IExportAdjustmentOverviewArgs {
	siteId?: number
	currencyIds: number[]
	adjustTypes: number[]
	vipLevels: number[]
	transId: string
	userName: string
	sabaId: string
	startTime: string
	endTime: string
}

export interface IGetAdjustmentOverviewArgs
	extends IExportAdjustmentOverviewArgs {
	pageNumber: number
	pageSize: number
}

export type IAdjustmentOverviewData = {
	currencyId: number
	isoCode: string
	totalPointEarned: number
	totalRecord: number
}

export type IAdjustmentListData = {
	id: number
	siteId: number
	siteName: string
	isoCode: string
	userName: string
	sabaId: string
	vipLevel: number
	vipLevelName: string
	transId: string
	adjustType: number
	pointEarned: number
	memo: string
	operator: string
	createTime: string
}

export interface IGetAdjustmentPointReportData {
	overview: IAdjustmentOverviewData[]
	list: {
		datas: IAdjustmentListData[]
		pageNumber: number
		totalPages: number
		rowCount: number
	}
}

export type IGetAdjustmentPointReportResponse =
	IAxiosResponse<IGetAdjustmentPointReportData>
