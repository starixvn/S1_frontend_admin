import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	ICryptoInfoData,
	IBlockCryptoWalletData,
	IGetBlockCryptoWalletArgs,
	ICryptoWalletGetByAddress,
	ICryptoWalletGetByAddressArgs,
	IBlockCryptoWalletSetArgs,
	IReleaseCryptoWalletArgs,
} from 'features/blockCryptoWallet/type'

export const blockCryptoWalletApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getCryptoInfoData: builder.query<IAxiosResponse<ICryptoInfoData>, void>({
			query: data => ({
				url: `GetAllData/GetCryptoInfoData`,
				method: 'POST',
				data,
			}),
		}),
		getBlockCryptoWallet: builder.query<
			IAxiosResponse<IBlockCryptoWalletData[]>,
			IGetBlockCryptoWalletArgs
		>({
			query: data => ({
				url: `Block/GetBlockCryptoWallet`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		cryptoWalletGetByAddress: builder.query<
			IAxiosResponse<ICryptoWalletGetByAddress[]>,
			ICryptoWalletGetByAddressArgs
		>({
			query: data => ({
				url: `Block/CryptoWalletGetByAddress`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		blockCryptoWalletSet: builder.mutation<
			IAxiosResponse<void>,
			IBlockCryptoWalletSetArgs
		>({
			query: data => ({
				url: `Block/BlockCryptoWalletSet`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		releaseCryptoWallet: builder.mutation<
			IAxiosResponse<void>,
			IReleaseCryptoWalletArgs
		>({
			query: body => ({
				url: `Block/ReleaseCryptoWallet`,
				method: 'POST',
				data: body,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetCryptoInfoDataQuery,
	useLazyGetBlockCryptoWalletQuery,
	useLazyCryptoWalletGetByAddressQuery,
	useBlockCryptoWalletSetMutation,
	useReleaseCryptoWalletMutation,
} = blockCryptoWalletApi
