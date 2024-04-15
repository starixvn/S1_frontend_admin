import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetLogReportListArgs {
	pageNumber: number
	pageSize: number
	siteIds: number[]
	currencyIds: number[]
	menus: number[]
	actionTypes: number[]
	startDate: string
	endDate: string
	userName: string
	transId: string
}

export interface ILogReportData {
	createTime: string
	id: number
	currencyId: number
	isoCode: string
	siteId: number
	siteName: string
	menu: number
	menuFunction: string
	actionType: number
	actionTypeName: string
	refTransId: string
	beforeDetailInfo: string
	afterDetailInfo: string
	operator: string
}

// export interface IGetLogReportListResponse {
// 	data: ILogReportData[]
// 	rowCount: number
// }

export type IGetLogReportListResponse = IAxiosResponse<ILogReportData[]>
