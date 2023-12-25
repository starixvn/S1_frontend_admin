import { rootApi } from 'common/service/rootApi/api'
import {
	IGetLeaderboardReportArgs,
	IGetLeaderboardReportExport,
	ILeaderboardReportData,
} from 'features/leaderboardReport/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

const leaderboardReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getLeaderboard: builder.query<
			IAxiosResponse<ILeaderboardReportData[]>,
			IGetLeaderboardReportArgs
		>({
			query: data => ({
				url: 'LeaderBoardReport/GetLeaderboardReport',
				method: 'POST',
				data,
			}),
		}),
		exportLeaderboardReport: builder.mutation<
			Blob,
			IGetLeaderboardReportExport
		>({
			query: data => ({
				url: 'LeaderBoardReport/GetLeaderboardReportExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),

		getLeaderboardBySiteIds: builder.query<
			IAxiosResponse<ILeaderboardReportData[]>,
			IGetLeaderboardReportArgs
		>({
			query: data => ({
				url: 'LeaderBoardReport/GetLeaderboardReportBySiteIds',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetLeaderboardQuery,
	useLazyGetLeaderboardBySiteIdsQuery,
	useExportLeaderboardReportMutation,
} = leaderboardReportApi
