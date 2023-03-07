import { rootApi } from 'common/service/rootApi/api'
import {
	IGetWinLossByCurrencyArgs,
	IGetWinLossByCurrencyExportArgs,
	IWinLossByCurrencyResponse,
	IGetWinLossByDateArgs,
	IGetWinLossByDateExportArgs,
	IWinLossByDateResponse,
	IGetWinLossByMonthArgs,
	IGetWinLossByMonthExportArgs,
	IWinLossByMonthResponse,
	IGetWinLossByPlayerArgs,
	IGetWinLossByPlayerDetailArgs,
	IWinLossByPlayerDetailResponse,
	IGetWinLossByPlayerExportArgs,
	IGetWinLossByTpCategoryTypeArgs,
	IGetWinLossByTpCategoryTypeExportArgs,
	IWinLossByTpCategoryTypeResponse,
	IGetWinLossByTpGameTypeArgs,
	IGetWinLossByTpGameTypeExportArgs,
	IWinLossByTpGameTypeResponse,
	IWinLossByPlayerResponse,
} from 'features/winLostReport/type'

export const winLostReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getWinLossByDate: builder.query<
			IWinLossByDateResponse,
			IGetWinLossByDateArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByDate',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByDate: builder.mutation<Blob, IGetWinLossByDateExportArgs>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByDateExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWinLossByMonth: builder.query<
			IWinLossByMonthResponse,
			IGetWinLossByMonthArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByMonth',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByMonth: builder.mutation<Blob, IGetWinLossByMonthExportArgs>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByMonthExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWinLossByTpGameType: builder.query<
			IWinLossByTpGameTypeResponse,
			IGetWinLossByTpGameTypeArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByTpGameType',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByTpGameType: builder.mutation<
			Blob,
			IGetWinLossByTpGameTypeExportArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByTpGameTypeExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWinLossByTpCategoryType: builder.query<
			IWinLossByTpCategoryTypeResponse,
			IGetWinLossByTpCategoryTypeArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByTpCategoryType',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByTpCategoryType: builder.mutation<
			Blob,
			IGetWinLossByTpCategoryTypeExportArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByTpCategoryTypeExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWinLossByPlayer: builder.query<
			IWinLossByPlayerResponse,
			IGetWinLossByPlayerArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByPlayer',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByPlayer: builder.mutation<
			Blob,
			IGetWinLossByPlayerExportArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByPlayerExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWinLossByPlayerDetail: builder.query<
			IWinLossByPlayerDetailResponse,
			IGetWinLossByPlayerDetailArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByPlayerDetail',
				method: 'POST',
				data,
			}),
		}),
		getWinLossByCurrency: builder.query<
			IWinLossByCurrencyResponse,
			IGetWinLossByCurrencyArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByCurrency',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByCurrency: builder.mutation<
			Blob,
			IGetWinLossByCurrencyExportArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByCurrencyExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})
export const {
	useLazyGetWinLossByDateQuery,
	useLazyGetWinLossByMonthQuery,
	useLazyGetWinLossByTpGameTypeQuery,
	useLazyGetWinLossByTpCategoryTypeQuery,
	useLazyGetWinLossByPlayerQuery,
	useLazyGetWinLossByPlayerDetailQuery,
	useLazyGetWinLossByCurrencyQuery,
	useExportWinLossByDateMutation,
	useExportWinLossByMonthMutation,
	useExportWinLossByTpGameTypeMutation,
	useExportWinLossByTpCategoryTypeMutation,
	useExportWinLossByPlayerMutation,
	useExportWinLossByCurrencyMutation,
} = winLostReportApi
