import { rootApi } from 'common/service/rootApi/api'
import {
	IExportUserOnlineReportArgs,
	IGetUserOnlineReportListArgs,
	IUserOnlineReportListResponse,
} from 'features/userOnlineReport/type'

export const userOnlineReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getUserOnlineReportList: builder.query<
			IUserOnlineReportListResponse,
			IGetUserOnlineReportListArgs
		>({
			query: data => ({
				url: 'UserOnlineReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportUserOnlineReport: builder.mutation<Blob, IExportUserOnlineReportArgs>(
			{
				query: data => ({
					url: 'UserOnlineReport/Export',
					method: 'POST',
					data,
					responseType: 'blob',
				}),
			}
		),
	}),
})
export const {
	useLazyGetUserOnlineReportListQuery,
	useExportUserOnlineReportMutation,
} = userOnlineReportApi
