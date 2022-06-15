import { createApi } from '@reduxjs/toolkit/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetBlockBankAccArgs,
	IBlockBankAccState,
	IGetBlockBankAccListArgs,
	IBlockBankAccListResponse,
	ISetBlockAccountArgs,
	ISetReleaseAccountArgs,
} from './type'

export const blockBankAccountApi = createApi({
	reducerPath: 'blockBankAccountApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getBlockBankAcc: builder.query<
			IAxiosResponse<IBlockBankAccState[]>,
			IGetBlockBankAccArgs
		>({
			query: data => ({
				url: `Block/GetBlockBankAcc`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getBlockBankAccList: builder.query<
			IAxiosResponse<IBlockBankAccListResponse[]>,
			IGetBlockBankAccListArgs
		>({
			query: data => ({
				url: `Block/GetBlockBankAccList`,
				method: 'POST',
				data,
			}),
		}),
		setBlockAccount: builder.mutation<void, ISetBlockAccountArgs>({
			query: data => ({
				url: `Block/BlockAccountSet`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setReleaseAccount: builder.mutation<void, ISetReleaseAccountArgs>({
			query: data => ({
				url: `Block/ReleaseAccount`,
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
	useSetReleaseAccountMutation,
} = blockBankAccountApi
