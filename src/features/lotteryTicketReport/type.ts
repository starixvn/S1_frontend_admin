import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetCustLotteryTicketArgs {
	siteId: number
	currencyIds: number[]
	roundId: number
	userName: string | null
	ticketNo: string | null
}

export interface ICustLotteryTicketData {
	siteId: number
	siteName: string
	custId: number
	currencyId: number
	isoCode: string
	userName?: string
	roundId: number
	ticketNo: string
	periodStartTime: string
	periodEndTime: string
	receivedTime: string
}

export type TCustLotteryTicketResponse = IAxiosResponse<
	ICustLotteryTicketData[]
>

export type TFilterForm = IExportCustLotteryTicketArgs

export interface IExportCustLotteryTicketArgs {
	siteId: number
	currencyIds: number[]
	roundId: number
	userName: string | null
	ticketNo: string | null
}
