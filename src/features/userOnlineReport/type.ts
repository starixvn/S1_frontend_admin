import dayjs from 'dayjs'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetUserOnlineReportListArgs {
	siteIds: number[]
	selectDate: string
	timeZone: number
}

export interface IUserOnlineReportData {
	localTime: string
	siteId: number
	siteName: string
	deviceType: number
	deviceName: string
	maxCount: number
}

export type IUserOnlineReportListResponse = IAxiosResponse<
	IUserOnlineReportData[]
>

export interface IExportUserOnlineReportArgs
	extends IGetUserOnlineReportListArgs {}

export interface IFilterForm {
	date: dayjs.Dayjs
	timeZone: number
}

export interface INewUserOnlineReportData {
	localTime: string
	desktop?: number
	h5?: number
	app?: number
	line?: number
}
