import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import dayjs from 'dayjs'

export interface IGetShieldTaggingReportArgs {
	siteId: number
	shieldId: string | null
	userName: string | null
	startDate: string
	endDate: string
	triggeredPoints: number[]
	platform: number[]
	tags: number[]
	pageNumber: number
	pageSize: number
}

export type IGetShieldTaggingReportExportArgs = Omit<
	IGetShieldTaggingReportArgs,
	'pageNumber' | 'pageSize'
>

export interface IGetShieldTaggingAssociateAccountReportArgs {
	shieldId: string
}

export interface IShieldTaggingReportData {
	siteId: number
	siteName: string
	currencyId: number
	custId: number
	userName: string
	shieldId: string
	triggeredPoint: number
	taggedIssue: number
	deviceScore: number
	version: string
	sessionId: string
	platform: string
	createTime: string
	updateTime: string
	associateAccount: number
	tags: Array<number>
}

export interface IShieldTaggingAssociateAccountData {
	siteId: number
	siteName: string
	currencyId: number
	custId: number
	userName: string
}

export interface IFilterForm {
	dateRange: [dayjs.Dayjs, dayjs.Dayjs]
	current?: number | undefined
	platform: number[]
	triggeredPoints: number[]
	tags: number[]
	userName: string
	shieldId: string
}

export type IShieldTaggingReportResponse = IAxiosResponse<
	IShieldTaggingReportData[]
>
