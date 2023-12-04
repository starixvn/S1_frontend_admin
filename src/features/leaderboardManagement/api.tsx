import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetLeaderboardPointCalculationArgs,
	IGetLeaderboardRankingBonusArgs,
	ILeaderboardPointCalculationData,
	ILeaderboardRankingBonusData,
	ISetLeaderboardPointCalculation,
	ISetLeaderboardRankingBonusArgs,
} from 'features/leaderboardManagement/type'

export const leaderboardManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getLeaderboardRankingBonus: builder.query<
			IAxiosResponse<ILeaderboardRankingBonusData[]>,
			IGetLeaderboardRankingBonusArgs
		>({
			query: data => ({
				url: 'LeaderBoardManagement/GetLeaderboardRankingBonus',
				method: 'POST',
				data,
			}),
			providesTags: ['POST2'],
		}),
		getLeaderboardPointCalculation: builder.query<
			IAxiosResponse<ILeaderboardPointCalculationData[]>,
			IGetLeaderboardPointCalculationArgs
		>({
			query: data => ({
				url: 'LeaderBoardManagement/GetLeaderboardPointCalculation',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setLeaderboardRankingBonus: builder.mutation<
			void,
			ISetLeaderboardRankingBonusArgs
		>({
			query: data => ({
				url: 'LeaderBoardManagement/SetLeaderboardRankingBonus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST2'],
		}),
		setLeaderboardPointCalculation: builder.mutation<
			void,
			ISetLeaderboardPointCalculation
		>({
			query: data => ({
				url: 'LeaderBoardManagement/SetLeaderboardPointCalculation',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetLeaderboardPointCalculationQuery,
	useGetLeaderboardRankingBonusQuery,
	useSetLeaderboardPointCalculationMutation,
	useSetLeaderboardRankingBonusMutation,
} = leaderboardManagementApi
