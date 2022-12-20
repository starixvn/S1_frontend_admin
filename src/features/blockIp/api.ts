import { rootApi } from 'common/service/rootApi/api'
import {
	IAddBlockIpArgs,
	IBlockIPListArgs,
	IBlockIpResponse,
	IDeleteBlockIpArgs,
} from './type'

export const blockIpApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBlockIpList: builder.query<IBlockIpResponse, IBlockIPListArgs>({
			query: data => ({
				url: 'Block/GetBlockIPList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		deleteBlockIp: builder.mutation<void, IDeleteBlockIpArgs>({
			query: data => ({
				url: 'Block/DeleteBlockIP',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		addBlockIp: builder.mutation<void, IAddBlockIpArgs>({
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
