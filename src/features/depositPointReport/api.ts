import { rootApi } from 'common/service/rootApi/api'
import {
	IExportDepositPointReportArgs,
	IGetDepositPointReportArgs,
	IGetDepositPointReportResponse,
} from './type'

export const depositPointReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositPointReport: builder.query<
			IGetDepositPointReportResponse,
			IGetDepositPointReportArgs
		>({
			query: data => ({
				url: 'Report/GetDepositPointReport',
				method: 'POST',
				data,
			}),
		}),
		exportDepositPointReport: builder.mutation<
			Blob,
			IExportDepositPointReportArgs
		>({
			query: data => ({
				url: 'Report/ExportDepositPointReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetDepositPointReportQuery,
	useExportDepositPointReportMutation,
} = depositPointReportApi
