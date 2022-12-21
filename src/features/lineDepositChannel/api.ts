import { rootApi } from 'common/service/rootApi/api'
import {
	IDeleteLineChannelArgs,
	IGetLineChannelListArgs,
	IGetLineChannelListResponse,
	ISetLineChannelArgs,
} from 'features/lineDepositChannel/type'

export const lineDepositChannelApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getChannelList: builder.query<
			IGetLineChannelListResponse,
			IGetLineChannelListArgs
		>({
			query: data => ({
				url: 'LineChannel/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setChannel: builder.mutation<void, ISetLineChannelArgs>({
			query: data => ({
				url: 'LineChannel/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteChannel: builder.mutation<void, IDeleteLineChannelArgs>({
			query: data => ({
				url: 'LineChannel/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetChannelListQuery,
	useSetChannelMutation,
	useDeleteChannelMutation,
} = lineDepositChannelApi
