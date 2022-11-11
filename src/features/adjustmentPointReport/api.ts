import { rootApi } from 'common/service/rootApi/api'
import {
	IExportAdjustmentOverviewArgs,
	IGetAdjustmentOverviewArgs,
	IGetAdjustmentPointReportResponse,
} from './type'

export const adjustmentPointReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getAdjustmentPointReport: builder.query<
			IGetAdjustmentPointReportResponse,
			IGetAdjustmentOverviewArgs
		>({
			query: data => ({
				url: 'Report/GetAdjustmentPointReport',
				method: 'POST',
				data,
			}),
		}),
		exportAdjustmentPointReport: builder.mutation<
			Blob,
			IExportAdjustmentOverviewArgs
		>({
			query: data => ({
				url: 'Report/ExportAdjustmentPointReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetAdjustmentPointReportQuery,
	useExportAdjustmentPointReportMutation,
} = adjustmentPointReportApi
