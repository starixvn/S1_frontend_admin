import { rootApi } from 'common/service/rootApi/api'
import {
	IGetWithdrawalLimitArgs,
	IGetWithdrawalLimitCryptoResponse,
	IGetWithdrawalLimitResponse,
	IUpdateWithdrawalLimitArgs,
	IUpdateWithdrawalLimitCryptoArgs,
} from 'features/withdrawalLimitation/type'

export const withdrawalLimitationApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getWithdrawalLimitList: builder.query<
			IGetWithdrawalLimitResponse,
			IGetWithdrawalLimitArgs
		>({
			query: data => ({
				url: 'WithdrawalLimit/GetList',
				method: 'POST',
				data,
			}),
		}),
		getWithdrawalCryptoLimitList: builder.query<
			IGetWithdrawalLimitCryptoResponse,
			IGetWithdrawalLimitArgs
		>({
			query: data => ({
				url: 'WithdrawalLimitCrypto/GetList',
				method: 'POST',
				data,
			}),
		}),
		updateWithdrawalLimit: builder.mutation<void, IUpdateWithdrawalLimitArgs>({
			query: data => ({
				url: 'WithdrawalLimit/Update',
				method: 'POST',
				data,
			}),
		}),
		updateWithdrawalCryptoLimit: builder.mutation<
			void,
			IUpdateWithdrawalLimitCryptoArgs
		>({
			query: data => ({
				url: 'WithdrawalLimitCrypto/Update',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetWithdrawalCryptoLimitListQuery,
	useLazyGetWithdrawalLimitListQuery,
	useUpdateWithdrawalCryptoLimitMutation,
	useUpdateWithdrawalLimitMutation,
} = withdrawalLimitationApi
