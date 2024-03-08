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
	IGetWinLossByPlayerExportArgs,
	IGetWinLossByTpCategoryTypeArgs,
	IGetWinLossByTpCategoryTypeExportArgs,
	IWinLossByTpCategoryTypeResponse,
	IGetWinLossByTpGameTypeArgs,
	IGetWinLossByTpGameTypeExportArgs,
	IWinLossByTpGameTypeResponse,
	IWinLossByPlayerResponse,
	IWinLossByBrandResponse,
	IGetWinLossByBrandArgs,
	IGetWinLossByBrandExportArgs,
	IGetWinLossByAffiliateArgs,
	IGetWinLossByAffiliateExportArgs,
	IWinLossByAffiliateResponse,
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
		getWinLossByBrand: builder.query<
			IWinLossByBrandResponse,
			IGetWinLossByBrandArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByBrand',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByBrand: builder.mutation<Blob, IGetWinLossByBrandExportArgs>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByBrandExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWinLossByAffiliate: builder.query<
			IWinLossByAffiliateResponse,
			IGetWinLossByAffiliateArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByAffiliate',
				method: 'POST',
				data,
			}),
		}),
		exportWinLossByAffiliate: builder.mutation<
			Blob,
			IGetWinLossByAffiliateExportArgs
		>({
			query: data => ({
				url: 'MpaWinLossReport/GetWinLossByAffiliateExport',
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
	useLazyGetWinLossByCurrencyQuery,
	useLazyGetWinLossByBrandQuery,
	useLazyGetWinLossByAffiliateQuery,
	useExportWinLossByDateMutation,
	useExportWinLossByMonthMutation,
	useExportWinLossByTpGameTypeMutation,
	useExportWinLossByTpCategoryTypeMutation,
	useExportWinLossByPlayerMutation,
	useExportWinLossByCurrencyMutation,
	useExportWinLossByBrandMutation,
	useExportWinLossByAffiliateMutation,
} = winLostReportApi
