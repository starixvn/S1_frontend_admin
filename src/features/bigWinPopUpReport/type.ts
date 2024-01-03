import { Moment } from 'moment'

export interface IGetBigWinReportArgs {
	startDate: string
	endDate: string
	currencyId: number[]
	siteId: number
}

export interface IBigWinReportData {
	site: string
	currency: string
	eventDate: string
	memberID: string
	category: string
	venderName: string
	gameName: string
	amount: number
}

export interface IExportBigWinReportArgs extends IGetBigWinReportArgs {}

export type IFilterForm = {
	dateRange: [Moment, Moment]
	currencyId: number[]
}
