import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import dayjs from 'dayjs'

export interface IGetStickerReportArgs {
	siteIds: number[]
	currencyIds: number[]
	roundId: number
	startDate: string
	endDate: string
	userName: string | null
	pageSize: number
	pageNumber: number
}

export interface IStickerReportData {
	siteId: number
	roundId: number | null
	custId: number
	userName?: string
	sabaId: string
	currencyId: number
	siteName: string
	stickerId: number
	isoCode: string
	stickerName: string
	stickerAmount: number
	purchaseTime: string
	roundStartDate: string
	roundEndDate: string
}
export interface IStickerReportCurrencyTotalData {
	currencyId: number
	isoCode: string
	currencyCount: number
	currencyAmount: number
}

export interface IStickerReportResponse {
	stickerReportData: IStickerReportData[]
	stickerReportCurrencyTotal: IStickerReportCurrencyTotalData[]
	pageNumber: number
	rowCount: number
	totalPages: number
}

export type TStickerReportResponse = IAxiosResponse<IStickerReportResponse>

export type TFilterForm = IGetStickerReportArgs

export interface IFilterForm extends IGetStickerReportArgs {
	dateRange: (dayjs.Dayjs | Date)[]
}

export interface IExportStickerReportArgs {
	siteIds: number[]
	currencyIds: number[]
	roundId: number
	userName: number
	startDate: string
	endDate: string
}
