import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export interface IForm {
	dateRange: [Moment, Moment]
	currencyIds: number[]
	otpProvider: number
	otpStatus: number
	userName: string
	phoneNo: number
}

export interface IGetOTPReportArgs {
	currencyList: number[]
	otpProvider: number
	otpStatus: number
	userName: string
	phoneNo: number
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export enum VerifiedEnum {
	Failed = 0,
	Success,
}

export interface IOtpReportData {
	siteId: number
	currencyId: number
	otpType: number
	custId: number
	userName: string
	otpProvider: string
	phoneNo: string
	content: string
	otpNum: string
	request_id: string
	otpStatus: number
	otpResponse: string
	verified: VerifiedEnum
	verifiedTime: string | null // * 畫面中的 Completed Time
	createTime: string | null
}

export type IOtpReportResponse = IAxiosResponse<IOtpReportData[]>
