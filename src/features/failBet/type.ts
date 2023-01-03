import { Moment } from 'moment'

export interface IGetFailRecordListArgs {
	siteIds: number[]
	currencyIds: number[]
	tpIds: number[]
	startTime: string
	endTime: string
	userName: string | null
	transId: string | null
	pageSize: number
	pageNumber: number
}

export type IExportFailBetRecordArgs = Omit<
	IGetFailRecordListArgs,
	'pageNumber' | 'pageSize'
>

export interface IGetFailRecordReportData {
	id: number
	transId: string
	tpId: number
	tpName: string
	siteId: number
	siteName: string
	userName: string
	currencyId: number
	currencyName: string
	transTime: string
	info: string
}

export interface IFilterForm {
	currencyIds: number[]
	tpIds: number[]
	dateRange: [Moment, Moment]
	userName: string
	transId: string
}
