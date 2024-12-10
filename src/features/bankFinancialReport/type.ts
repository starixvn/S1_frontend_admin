import dayjs from 'dayjs'

export interface IGetBankFinancialReportArgs {
	siteId?: number
	currencyIds: number[]
	startTime: string
	endTime: string
	channel: number[] | null
	agents: number[] | null
	financialAccountIds: number[] | null
}

export interface IGetBankFinancialReportData {
	key: string
	fees: number
	openBalance: number
	closingBalance: number
	netBalance: number
	// details 內容未知無法定義，透過取得 response 之後再建檔 ,
	details?: object
	// Recursion
	children?: IGetBankFinancialReportData[]
}

// 取得帳戶列表
export interface IGetFinancialAccountListArgs {
	siteId?: number
	purposes: null
}

export interface IGetFinancialAccountData {
	financialId: number
	currencyId: number
	isoCode: string
	sysId: number
	bankCode: string
	channel: number
	agent: string | null
	payId: number
	payName: string
	accountNo: string
	accountName: string
	displayName: string
	status: number
}

export type IFilterForm = {
	dateRange: [dayjs.Dayjs, dayjs.Dayjs]
	currencyIds: number[]
	channel: Array<number | string>
	agents: Array<number>
	financialAccountIds: Array<number | string>
}

export type ITableColumnsInfo = {
	dataIndex: string
}
