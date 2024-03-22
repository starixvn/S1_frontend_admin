import { rootApi } from 'common/service/rootApi/api'
import {
	IExportCupEventReportArgs,
	IGetCupEventReportArg,
	IGetCupEventReportResponse,
	ISetPayoutArgs,
} from './type'

export const cupEventTeamReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getCupEventTeamReport: builder.query<
			IGetCupEventReportResponse,
			IGetCupEventReportArg
		>({
			query: data => ({
				url: 'CupEvent/GetCupEventReport',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		exportCupEventTeamReport: builder.mutation<Blob, IExportCupEventReportArgs>(
			{
				query: data => ({
					url: 'CupEvent/ExportEventReport',
					method: 'POST',
					data,
					responseType: 'blob',
				}),
			}
		),
		setPayout: builder.mutation<void, ISetPayoutArgs>({
			query: data => ({
				url: 'CupEvent/SetPayoutDone',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetCupEventTeamReportQuery,
	useExportCupEventTeamReportMutation,
	useSetPayoutMutation,
} = cupEventTeamReportApi
