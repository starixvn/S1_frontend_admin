import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Dayjs } from 'dayjs'

export interface IGetWithdrawalTimeReportListArgs {
	withdrawalId: string | null
	siteIds: number[]
	currencyId: number[]
	status: number[]
	memberId: string | null
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export interface IWithdrawalTimeReportData {
	siteName: string
	siteId: number
	status: number
	createTime: string
	updateTime: string
	verifyTime: string | null
	processTime: string | null
	flowEndTime: string
	transId: string
	withdrawalType: number
	userName: string
	custId: number
	isoCode: string
	depositTime: string | null
	completeTime: string
	withdrawalTypeName: string
	statusName: string
	withdrawalId: number
	toVerifyTime: string | null
	toApprovedTime: string | null
	operator: string | null
	verifiedBy: string | null
	processedBy: string | null
	approvedBy: string | null
	withdrawalMessageList: { createTime: string; message: string }[]
}

export type ICurrencyAmountRecordData = {
	currency: string
	amount: number
	record: number
}

export interface IWithdrawalTimeReportListResponse
	extends IAxiosResponse<IWithdrawalTimeReportData[]> {
	currencyAmountRecord: ICurrencyAmountRecordData[]
}

export interface IExportWithdrawalTimeReportArgs {
	withdrawalId: string | null
	siteIds: number[]
	currencyId: number[]
	status: number[]
	memberId: string | null
	startDate: string
	endDate: string
}

export type IFilterForm = {
	dateRange: [Dayjs, Dayjs]
	currencyIds: number[]
	statuses: number[]
	memberId: string
	withdrawalId: string
}
