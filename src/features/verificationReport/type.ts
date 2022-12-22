import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export interface IVerificationRewardReportArgs {
	pageNumber: number
	pageSize: number
	userName: string
	sabaId: string
	currencyIds: number[]
	startDate: string
	endDate: string
}

export interface IVerificationRewardReportData {
	siteName: string
	custId: number
	userName: string
	sabaId: string
	agent: string
	currencyId: number
	currency: string
	phoneVerified: true
	phoneReward: number
	phoneRewardTime: string
	emailVerified: true
	emailReward: number
	emailRewardTime: string
	verificationReawardAmount: number
	verificationReawardTime: string
}

export type IVerificationRewardReportResponse = IAxiosResponse<
	IVerificationRewardReportData[]
>

export interface IExportVerificationRewardReportArgs {
	currencyIds: number[]
	userName: string
	sabaId: string
	startDate: string
	endDate: string
}

export interface IFilterForm {
	memberId: string
	sabaId: string
	currencyIds: number[]
	dateRange: [Moment, Moment]
	pageNumber: number
	pageSize: number
}
