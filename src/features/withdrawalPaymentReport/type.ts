import moment from 'moment/moment'

export interface IGetWithdrawalReportArgs {
	siteId?: number
	currencyIds: number[]
	baseCurrencyId: number
	payIds: number[]
	types: number[]
	userNames: string
	startTime: string
	endTime: string
	groupBy: string
}

export type IGetWithdrawalReportExportArgs = Omit<IGetWithdrawalReportArgs, ''>

export interface IGetWithdrawalTypeData {
	name: string
	value: number
}

export interface IGetWithdrawalReportData {
	key: string
	children?: IGetWithdrawalReportData[]
}

export type IFilterForm = {
	dateRange: [moment.Moment, moment.Moment]
	currencyIds: number[]
	baseCurrencyId: number
	payIds: number[]
	types: number[]
	userNames: string
	groupBy: string
}
