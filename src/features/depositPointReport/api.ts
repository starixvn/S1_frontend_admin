import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IExportDepositPointReportArgs,
	IGetDepositPointReportArgs,
	IGetDepositPointReportResponse,
} from './type'

export const depositPointReportApi = createApi({
	reducerPath: 'depositPointReportApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
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
