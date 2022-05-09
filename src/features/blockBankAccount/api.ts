import { createApi } from '@reduxjs/toolkit/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IBlockBankAccArgs,
	IBlockBankAccResponse,
	IGetBlockBankAccListArgs,
	IGetBlockBankAccListResponse,
	ISetBlockAccountArgs,
} from './type'

export const blockBankAccountApi = createApi({
	reducerPath: 'blockBankAccountApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getBlockBankAcc: builder.query<IBlockBankAccResponse[], IBlockBankAccArgs>({
			query: data => ({
				url: `Block/GetBlockBankAcc`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getBlockBankAccList: builder.query<
			IGetBlockBankAccListResponse[],
			IGetBlockBankAccListArgs
		>({
			query: data => ({
				url: `Block/GetBlockBankAccList`,
				method: 'POST',
				data,
			}),
		}),
		setBlockAccount: builder.mutation<null, ISetBlockAccountArgs>({
			query: data => ({
				url: `Block/BlockAccountSet`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetBlockBankAccQuery,
	useLazyGetBlockBankAccListQuery,
	useSetBlockAccountMutation,
} = blockBankAccountApi
