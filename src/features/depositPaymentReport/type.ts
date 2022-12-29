import moment from 'moment'

export interface IGetDepositReportArgs {
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

export type IGetDepositReportExportArgs = Omit<IGetDepositReportArgs, ''>

export interface IGetDepositTypeData {
	name: string
	value: number
}

export interface IGetDepositReportData {
	key: string
	children?: IGetDepositReportData[]
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
