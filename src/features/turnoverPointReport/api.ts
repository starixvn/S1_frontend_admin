import { rootApi } from 'common/service/rootApi/api'
import {
	IExportTurnoverPointReportArgs,
	IGetTurnoverPointReportArgs,
	IGetTurnoverPointReportResponse,
} from 'features/turnoverPointReport/type'

export const turnoverPointReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getTurnoverPointReport: builder.query<
			IGetTurnoverPointReportResponse,
			IGetTurnoverPointReportArgs
		>({
			query: data => ({
				url: 'Report/GetTurnoverPointReport',
				method: 'POST',
				data,
			}),
		}),
		exportTurnoverPointReport: builder.mutation<
			Blob,
			IExportTurnoverPointReportArgs
		>({
			query: data => ({
				url: 'Report/ExportTurnoverPointReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetTurnoverPointReportQuery,
	useExportTurnoverPointReportMutation,
} = turnoverPointReportApi
