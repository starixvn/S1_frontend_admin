import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IExportTurnoverPointReportArgs {
	siteId?: number
	currencyIds: number[]
	vipLevels: number[]
	categories: number[]
	userName: string
	sabaId: string
	startTime: string
	endTime: string
}

export interface IGetTurnoverPointReportArgs
	extends IExportTurnoverPointReportArgs {
	pageNumber: number
	pageSize: number
}

export type ITurnoverPointOverviewData = {
	currencyId: number
	isoCode: string
	totalPointEarned: number
	totalRecord: number
}

export type ITurnoverPointListData = {
	id: number
	siteId: number
	siteName: string
	isoCode: string
	userName: string
	sabaId: string
	vipLevel: number
	vipLevelName: string
	tpCategoryId: number
	categoryName: string | null
	pointEarned: number
	settleDate: string
	createTime: string
}

export interface IGetTurnoverPointReportData {
	overview: ITurnoverPointOverviewData[]
	list: {
		pageNumber: number
		totalPages: number
		rowCount: number
		datas: ITurnoverPointListData[]
	}
}

export type IGetTurnoverPointReportResponse =
	IAxiosResponse<IGetTurnoverPointReportData>
