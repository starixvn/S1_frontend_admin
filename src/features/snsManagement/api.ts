import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetSNSListArgs,
	IGetSNSListResponse,
	ISetDataArgs,
	ISetSortArgs,
} from 'features/snsManagement/type'

export const snsManagementApi = createApi({
	reducerPath: 'snsManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
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
