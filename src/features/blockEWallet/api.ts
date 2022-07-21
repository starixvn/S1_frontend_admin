import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IBlockEWalletAccResponse,
	IBlockEWalletResponse,
	IEWalletTypesResponse,
	IGetBlockEWalletAccArgs,
	IGetBlockEWalletListArgs,
	ISetBlockEWalletArgs,
	ISetReleaseEWalletArgs,
} from './type'

export const blockEWalletApi = createApi({
	reducerPath: 'blockEWalletApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		// * E-Wallet 清單
		getBlockEWalletAcc: builder.query<
			IBlockEWalletAccResponse,
			IGetBlockEWalletAccArgs
		>({
			query: body => ({
				url: `EWallet/GetBlockEWalletAcc`,
				method: 'POST',
				data: body,
			}),
			providesTags: ['POST'],
		}),
		// * Block E-Wallet 後會受影響的用戶清單
		getBlockEWalletList: builder.query<
			IBlockEWalletResponse,
			IGetBlockEWalletListArgs
		>({
			query: body => ({
				url: `EWallet/GetBlockEWalletList`,
				method: 'POST',
				data: body,
			}),
			providesTags: ['POST'],
		}),
		// * E-Wallet 類別清單
		GetEWalletTypes: builder.query<IEWalletTypesResponse, null>({
			query: body => ({
				url: `EWallet/GetEWalletInfo`,
				method: 'POST',
				data: body,
			}),
			providesTags: ['POST'],
		}),
		// * Block E-Wallet
		setBlockEWallet: builder.mutation<
			IAxiosResponse<void>,
			ISetBlockEWalletArgs
		>({
			query: body => ({
				url: `EWallet/BlockEWalletSet`,
				method: 'POST',
				data: body,
			}),
			invalidatesTags: ['POST'],
		}),

		//  * Release E-Wallet
		setReleaseEWallet: builder.mutation<
			IAxiosResponse<void>,
			ISetReleaseEWalletArgs
		>({
			query: body => ({
				url: `EWallet/ReleaseAccount`,
				method: 'POST',
				data: body,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetBlockEWalletAccQuery,
	useLazyGetBlockEWalletListQuery,
	useGetEWalletTypesQuery,
	useSetBlockEWalletMutation,
	useSetReleaseEWalletMutation,
} = blockEWalletApi
