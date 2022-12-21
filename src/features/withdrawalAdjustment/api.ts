import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IGetWithdrawalReasonListResponse,
	IGetWithdrawalAdjustmentArgs,
	IGetWithdrawalAdjustmentResponse,
	ISubmitWithdrawalLimitAdjustArgs,
} from 'features/withdrawalAdjustment/type'

export const withdrawalAdjustmentApi = rootApi.injectEndpoints({
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
			providesTags: ['POST'],
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
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetWithdrawalAdjustmentQuery,
	useGetWithdrawalAdjustmentReasonListQuery,
	useSubmitWithdrawalAdjustmentMutation,
} = withdrawalAdjustmentApi
