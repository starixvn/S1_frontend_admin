import { Dayjs } from 'dayjs'

export interface IGetFpsReportArgs {
	siteIds?: number[]
	currencyIds: number[]
	deviceType: number
	userName: string | null
	deviceId: string | null
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export type IGetFpsReportExportArgs = Omit<
	IGetFpsReportArgs,
	'pageNumber' | 'pageSize'
>

export interface IGetFpsAssociateAccountArgs {
	deviceId: string
}

export interface IGetFpsAssociateDevicesArgs {
	custId: number
}

export type TFpsReportData = {
	lastUsedTime: string
	siteId: number
	siteName: string
	custId: number
	isoCode: string
	userName: string
	action: string
	deviceId: string
	riskLevel: string
	browser: string
	deviceType: string
	ipAddress: string
	robotTracking: string
	associateDevices: number
	associateCount: number
}

export type TFpsAssociateAccountData = {
	custId: number
	userName: string
}

export type TFpsAssociateDevicesData = {
	deviceId: string
}

export interface IFilterForm {
	dateRange: [Dayjs, Dayjs]
	siteIds: number[]
	currencyIds: number[]
	deviceType: number
	userName: string | null
	deviceId: string | null
}
