import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IExportWorldCupReportArgs,
	IGetWorldCupReportArg,
	IGetWorldCupReportResponse,
	ISetPayoutArgs,
} from './type'

export const worldCupTeamReportApi = createApi({
	reducerPath: 'worldCupTeamReportApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getWorldCupTeamReport: builder.query<
			IGetWorldCupReportResponse,
			IGetWorldCupReportArg
		>({
			query: data => ({
				url: 'WorldCupPrediction/GetEventReport',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		exportWorldCupTeamReport: builder.mutation<Blob, IExportWorldCupReportArgs>(
			{
				query: data => ({
					url: 'WorldCupPrediction/ExportEventReport',
					method: 'POST',
					data,
					responseType: 'blob',
				}),
			}
		),
		setPayout: builder.mutation<void, ISetPayoutArgs>({
			query: data => ({
				url: 'WorldCupPrediction/SetPayoutDone',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetWorldCupTeamReportQuery,
	useExportWorldCupTeamReportMutation,
	useSetPayoutMutation,
} = worldCupTeamReportApi
