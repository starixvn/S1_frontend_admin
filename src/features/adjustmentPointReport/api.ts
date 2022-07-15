import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IExportAdjustmentOverviewArgs,
	IGetAdjustmentOverviewArgs,
	IGetAdjustmentPointReportResponse,
} from './type'

export const adjustmentPointReportApi = createApi({
	reducerPath: 'adjustmentPointReportApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
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
