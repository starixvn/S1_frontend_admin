import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { IAdjustmentOverviewData } from '../adjustmentPointReport/type'

export interface IExportDepositPointReportArgs {
	siteId?: number
	currencyIds: number[]
	vipLevels: number[]
	transId: string
	userName: string
	sabaId: string
	startTime: string
	endTime: string
}

export interface IGetDepositPointReportArgs
	extends IExportDepositPointReportArgs {
	pageNumber: number
	pageSize: number
}

export type IDepositPointReportOverviewData = IAdjustmentOverviewData

export type IDepositPointReportListData = {
	id: number
	siteId: number
	siteName: string
	isoCode: string
	userName: string
	sabaId: string
	vipLevel: number
	vipLevelName: string
	transId: string
	amount: number
	pointEarned: number
	memo: string
	operator: string
	createTime: string
}

export interface IGetDepositPointReportData {
	overview: IDepositPointReportOverviewData[]
	list: {
		datas: IDepositPointReportListData[]
		pageNumber: number
		totalPages: number
		rowCount: number
	}
}

export type IGetDepositPointReportResponse =
	IAxiosResponse<IGetDepositPointReportData>
