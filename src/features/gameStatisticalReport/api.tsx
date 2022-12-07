import { rootApi } from 'common/service/rootApi/api'
import {
	IGameStatisticalReportResponse,
	IGetGameStatisticalReportListArgs,
} from './type'

export const gameStatisticalReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getGameStatisticalReportList: builder.query<
			IGameStatisticalReportResponse,
			IGetGameStatisticalReportListArgs
		>({
			query: data => ({
				url: 'GameStatisticalReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportGameStatisticalReport: builder.mutation<
			Blob,
			IGetGameStatisticalReportListArgs
		>({
			query: data => ({
				url: 'GameStatisticalReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetGameStatisticalReportListQuery,
	useExportGameStatisticalReportMutation,
} = gameStatisticalReportApi
