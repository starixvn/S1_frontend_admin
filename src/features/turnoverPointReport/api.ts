import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IExportTurnoverPointReportArgs,
	IGetTurnoverPointReportArgs,
	IGetTurnoverPointReportResponse,
} from 'features/turnoverPointReport/type'

export const turnoverPointReportApi = createApi({
	reducerPath: 'turnoverPointReportApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
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
