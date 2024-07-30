import { rootApi } from 'common/service/rootApi/api'
import type {
	IGetCustLotteryTicketArgs,
	TCustLotteryTicketResponse,
	IExportCustLotteryTicketArgs,
} from './type'

export const ticketReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getCustLotteryTicket: builder.query<
			TCustLotteryTicketResponse,
			IGetCustLotteryTicketArgs
		>({
			query: data => ({
				url: 'LotteryEvent/GetCustLotteryTicket',
				method: 'POST',
				data,
			}),
		}),
		exportCustLotteryTicket: builder.mutation<
			Blob,
			IExportCustLotteryTicketArgs
		>({
			query: data => ({
				url: 'LotteryEvent/GetCustLotteryTicketExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetCustLotteryTicketQuery,
	useExportCustLotteryTicketMutation,
} = ticketReportApi
