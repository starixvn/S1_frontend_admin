import dayjs from 'dayjs'

export interface IExportDrawPrizeReportArgs {
	siteId?: number
	currencyIds: number[]
	startDate: string
	endDate: string
	eventNames: string[]
}

export interface IGetDrawPrizeReportArgs extends IExportDrawPrizeReportArgs {
	pageNumber: number
	pageSize: number
}

export type IDrawPrizeReport = {
	siteId: number
	currencyId: number
	eventId: number
	prizeId: number
	usedQuantity: number
	startTime: string
	endTime: string
	prizeType: number
	prizeName: string
	amount: number
	currency: string
	siteName: string
	eventDate: string
	eventTime: string
	eventName: string
}

export type ICurrencyAmountData = {
	currencyId: number
	currencyName: string
	totalRecord: number
	totalAmount: number
}

// 這隻api 把 pageInfo 塞在 data內
export interface IGetDrawPrizeReportData {
	data: IDrawPrizeReport[]
	currencyAmount: ICurrencyAmountData[]
	totalPages?: number
	pageNumber?: number
	rowCount?: number
}

export interface IGetDrawPrizeReportLogArgs {
	eventId: number
	prizeId: number
	eventTime: string
	prizeName: string
	pageNumber: number
	pageSize: number
}

export interface IGetDrawPrizeReportLogData {
	userName: string
	drawTime: string
}

export interface IFilterForm {
	dateRange: [dayjs.Dayjs, dayjs.Dayjs]
	currencyIds: number[]
	eventNames: string[]
}
