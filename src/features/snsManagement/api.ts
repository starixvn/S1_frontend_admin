import { rootApi } from 'common/service/rootApi/api'
import {
	IGetSNSListArgs,
	IGetSNSListResponse,
	ISetDataArgs,
	ISetSortArgs,
} from 'features/snsManagement/type'

export const snsManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDataList: builder.query<IGetSNSListResponse, IGetSNSListArgs>({
			query: data => ({
				url: 'SocialNetwork/GetDataList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setSort: builder.mutation<void, ISetSortArgs>({
			query: data => ({
				url: 'SocialNetwork/SetSort',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setData: builder.mutation<void, ISetDataArgs>({
			query: data => ({
				url: 'SocialNetwork/SetData',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetDataListQuery,
	useSetDataMutation,
	useSetSortMutation,
} = snsManagementApi
