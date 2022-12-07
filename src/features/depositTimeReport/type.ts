import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import moment from 'moment'

export type IFilterForm = {
	dateRange: [moment.Moment, moment.Moment]
	currencyIds: number[]
	statuses: number[]
	memberId: string
	depositId: string
}

export interface IGetDepositTimeReportArgs {
	depositId: string | null
	siteIds: number[]
	currencyId: number[]
	status: number[]
	memberId: string | null
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export interface IDepositTimeReportData {
	siteName: string
	siteId: number
	status: number
	createTime: string
	updateTime: string
	transId: string
	depositType: number
	userName: string
	custId: number
	isoCode: string
	depositTime: string
	completeTime: string
	depositTypeName: string
	statusName: string
	depositId: number
	approvedTime: string
	toApprovedTime: string
	approvedBy: string
}

export type ICurrencyAmountRecordData = {
	currency: string
	amount: number
	record: number
}

export interface IDepositTimeReportResponse
	extends IAxiosResponse<IDepositTimeReportData[]> {
	currencyAmountRecord: ICurrencyAmountRecordData[]
}

export interface IExportDepositTimeReportArgs {
	depositId: string | null
	siteIds: number[]
	currencyIds: number[]
	statuses: number[]
	memberId: string | null
	startDate: string
	endDate: string
}
