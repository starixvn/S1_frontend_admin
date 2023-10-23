import { rootApi } from 'common/service/rootApi/api'
import {
	IGetConfiscatedListArgs,
	IConfiscatedResponse,
	IGetConfiscatedSummaryArgs,
	IConfiscatedSummaryResponse,
	IExportConfiscatedArgs,
} from './type'

export const confiscateSummaryReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getConfiscatedList: builder.query<
			IConfiscatedResponse,
			IGetConfiscatedListArgs
		>({
			query: data => ({
				url: 'ConfiscatedSummaryReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		getConfiscatedSummary: builder.query<
			IConfiscatedSummaryResponse,
			IGetConfiscatedSummaryArgs
		>({
			query: data => ({
				url: 'ConfiscatedSummaryReport/GetSummary',
				method: 'POST',
				data,
			}),
		}),
		exportConfiscated: builder.mutation<Blob, IExportConfiscatedArgs>({
			query: data => ({
				url: 'ConfiscatedSummaryReport/ExportList',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetConfiscatedListQuery,
	useLazyGetConfiscatedSummaryQuery,
	useExportConfiscatedMutation,
} = confiscateSummaryReportApi
