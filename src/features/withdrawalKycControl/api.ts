import { rootApi } from 'common/service/rootApi/api'
import {
	IGetWithdrawalKycListArgs,
	IGetWithdrawalKycResponse,
	IUpdateWithdrawalKycArgs,
} from 'features/withdrawalKycControl/type'

export const withdrawalKycControlApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getWithdrawalKycList: builder.query<
			IGetWithdrawalKycResponse,
			IGetWithdrawalKycListArgs
		>({
			query: data => ({
				url: 'WithdrawalKYC/GetList',
				method: 'POST',
				data,
			}),
		}),
		updateWithdrawalKyc: builder.mutation<void, IUpdateWithdrawalKycArgs>({
			query: data => ({
				url: 'WithdrawalKYC/Update',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetWithdrawalKycListQuery,
	useUpdateWithdrawalKycMutation,
} = withdrawalKycControlApi
