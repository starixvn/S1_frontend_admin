import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import { IBlockIPListArgs, IBlockIpResponse } from './type'

export const blockIpApi = createApi({
	reducerPath: 'blockIpApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getBlockIpList: builder.query<IBlockIpResponse, IBlockIPListArgs>({
			query: data => ({
				url: 'Block/GetBlockIPList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		deleteBlockIp: builder.mutation<void, { ip: string }>({
			query: data => ({
				url: 'Block/DeleteBlockIP',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		addBlockIp: builder.mutation<void, { ip: string; memo: string }>({
			query: data => ({
				url: 'Block/SetBlockIP',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetBlockIpListQuery,
	useDeleteBlockIpMutation,
	useAddBlockIpMutation,
} = blockIpApi
