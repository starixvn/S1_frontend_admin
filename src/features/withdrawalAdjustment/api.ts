import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetWithdrawalReasonListResponse,
	IGetWithdrawalAdjustmentArgs,
	IGetWithdrawalAdjustmentResponse,
	ISubmitWithdrawalLimitAdjustArgs,
} from 'features/withdrawalAdjustment/type'

export const withdrawalAdjustmentApi = createApi({
	reducerPath: 'withdrawalAdjustmentApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['Submit'],
	endpoints: builder => ({
		getWithdrawalAdjustment: builder.query<
			IGetWithdrawalAdjustmentResponse,
			IGetWithdrawalAdjustmentArgs
		>({
			query: data => ({
				url: 'WithdrawalLimitAdjustment/GetCustAndWalletInfo',
				method: 'POST',
				data,
			}),
			providesTags: ['Submit'],
		}),
		getWithdrawalAdjustmentReasonList: builder.query<
			IGetWithdrawalReasonListResponse,
			null
		>({
			query: data => ({
				url: 'WithdrawalLimitAdjustment/GetReasonList',
				method: 'POST',
				data,
			}),
		}),
		submitWithdrawalAdjustment: builder.mutation<
			IAxiosResponse<null>,
			ISubmitWithdrawalLimitAdjustArgs
		>({
			query: data => ({
				url: 'WithdrawalLimitAdjustment/Submit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['Submit'],
		}),
	}),
})

export const {
	useLazyGetWithdrawalAdjustmentQuery,
	useGetWithdrawalAdjustmentReasonListQuery,
	useSubmitWithdrawalAdjustmentMutation,
} = withdrawalAdjustmentApi
