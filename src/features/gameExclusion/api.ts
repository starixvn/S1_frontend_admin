import { rootApi } from 'common/service/rootApi/api'
import {
	IDeleteGameExclusionArgs,
	IGameExclusionByCustIdData,
	IGameExclusionData,
	IGetGameExclusionListArgs,
	ISetGameExclusionArgs,
	IUpdateGameExclusionStatusArgs,
} from 'features/gameExclusion/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

const gameExclusionApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getGameExclusionList: builder.query<
			IAxiosResponse<IGameExclusionData[]>,
			IGetGameExclusionListArgs
		>({
			query: data => ({
				url: 'TpDisable/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getGameExclusionById: builder.query<
			IAxiosResponse<IGameExclusionByCustIdData>,
			{ custId: number }
		>({
			query: data => ({
				url: 'TpDisable/GetByCustId',
				method: 'POST',
				data,
			}),
		}),
		setGameExclusion: builder.mutation<
			IAxiosResponse<void>,
			ISetGameExclusionArgs
		>({
			query: data => ({
				url: 'TpDisable/Set',
				method: 'POST',
				data,
			}),
		}),
		updateGameExclusionStatus: builder.mutation<
			IAxiosResponse<void>,
			IUpdateGameExclusionStatusArgs
		>({
			query: data => ({
				url: 'TpDisable/UpdateStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteGameExclusion: builder.mutation<
			IAxiosResponse<void>,
			IDeleteGameExclusionArgs
		>({
			query: data => ({
				url: 'TpDisable/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetGameExclusionListQuery,
	useLazyGetGameExclusionByIdQuery,
	useSetGameExclusionMutation,
	useUpdateGameExclusionStatusMutation,
	useDeleteGameExclusionMutation,
} = gameExclusionApi
