import { Dayjs } from 'dayjs'

export interface IGetIovationReportArgs {
	currencyId: number
	deviceType: number
	userName: string | null
	deviceId: string | null
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export type IGetIovationReportExportArgs = Omit<
	IGetIovationReportArgs,
	'pageNumber' | 'pageSize'
>

export interface IGetIovationAssociateAccountArgs {
	deviceId: string
}

export interface IIovationReportData {
	lastUsedTime: string
	userName: string
	deviceId: string
	allow: string
	deviceType: string
	score: number
	frequency: number
	associateCount: number
}

export interface IIovationAssociateAccountData {
	custId: number
	userName: string
}

export interface IFilterForm {
	dateRange: [Dayjs, Dayjs]
	currencyId: number
	deviceType: number
	userName: string | null
	deviceId: string | null
}
