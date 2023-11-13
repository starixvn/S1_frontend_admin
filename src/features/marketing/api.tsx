import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IGetPerformanceHighlightArgs,
	IPerformanceHighlightResponse,
	IExportPerformanceHighlightArgs,
	IPerformanceHighlightDataForMultiSitesData,
	IGetPerformanceHighlightDataForMultiSitesArgs,
} from 'features/marketing/type'

export const marketingDashBoardApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPerformanceHighlight: builder.query<
			IPerformanceHighlightResponse,
			IGetPerformanceHighlightArgs
		>({
			query: data => ({
				url: 'MpaMarketingDashboard/GetPerformanceHighlightData',
				method: 'POST',
				data,
			}),
		}),
		exportPerformanceHighlight: builder.mutation<
			Blob,
			IExportPerformanceHighlightArgs
		>({
			query: data => ({
				url: 'MpaMarketingDashboard/GetPerformanceHighlightDataExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),

		// * support multi site api
		getPerformanceHighlightDataForMultiSites: builder.query<
			IAxiosResponse<IPerformanceHighlightDataForMultiSitesData[]>,
			IGetPerformanceHighlightDataForMultiSitesArgs
		>({
			query: data => ({
				url: 'MpaMarketingDashboard/GetPerformanceHighlightDataForMultiSites',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetPerformanceHighlightQuery,
	useExportPerformanceHighlightMutation,
	useLazyGetPerformanceHighlightDataForMultiSitesQuery,
} = marketingDashBoardApi
