import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetWithdrawalKycListArgs,
	IGetWithdrawalKycResponse,
	IUpdateWithdrawalKycArgs,
} from 'features/withdrawalKycControl/type'

export const withdrawalKycControlApi = createApi({
	reducerPath: 'withdrawalKycControlApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
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
