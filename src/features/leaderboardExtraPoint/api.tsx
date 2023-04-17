import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetLeaderboardExtraPointArgs,
	IExportLeaderboardExtraPointArgs,
	ILeaderboardExtraPointData,
	IExtraPointResponse,
} from 'features/leaderboardExtraPoint/type'

export const extraPointApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getLeaderboardExtraPoint: builder.query<
			IAxiosResponse<ILeaderboardExtraPointData[]>,
			IGetLeaderboardExtraPointArgs
		>({
			query: data => ({
				url: 'LeaderBoardAdjustment/GetExtraPointList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		exportLeaderboardExtraPoint: builder.mutation<
			Blob,
			IExportLeaderboardExtraPointArgs
		>({
			query: data => ({
				url: 'LeaderBoardAdjustment/GetExtraPointListExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		addLeaderboardExtraPoint: builder.mutation<IExtraPointResponse, FormData>({
			query: data => ({
				url: 'LeaderBoardAdjustment/SetBatchExtraPoint',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetLeaderboardExtraPointQuery,
	useExportLeaderboardExtraPointMutation,
	useAddLeaderboardExtraPointMutation,
} = extraPointApi
