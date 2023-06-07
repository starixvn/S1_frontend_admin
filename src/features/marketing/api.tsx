import { rootApi } from 'common/service/rootApi/api'
import {
	IGetPerformanceHighlightArgs,
	IPerformanceHighlightResponse,
	IExportPerformanceHighlightArgs,
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
	}),
})

export const {
	useLazyGetPerformanceHighlightQuery,
	useExportPerformanceHighlightMutation,
} = marketingDashBoardApi
