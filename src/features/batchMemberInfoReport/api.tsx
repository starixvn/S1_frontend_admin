import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'

import {
	IGetBatchMemberInfoReportArgs,
	IBatchMemberInfoReportResponse,
} from 'features/batchMemberInfoReport/type'

export const batchMemberInfoReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBatchMemberInfoReportList: builder.query<
			IBatchMemberInfoReportResponse,
			IGetBatchMemberInfoReportArgs
		>({
			query: data => ({
				url: 'BatchMemberInfoReport/Get',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		importBatchMemberInfoReport: builder.mutation<
			IAxiosResponse<null>,
			FormData
		>({
			query: data => ({
				url: 'BatchMemberInfoReport/Import',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetBatchMemberInfoReportListQuery,
	useImportBatchMemberInfoReportMutation,
} = batchMemberInfoReportApi
