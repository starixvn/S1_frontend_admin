import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IAdjustmentLimitResponse,
	ICheckPasswordArgs,
	ICustInfoWithBalanceResponse,
	IGetAdjustmentLimitInfoArgs,
	IGetAdjustmentTypeResponse,
	IGetCustInfoWithBalanceArgs,
	IGetReasonListResponse,
	ISubmitAdjustmentArgs,
	IGetReasonListArgs,
} from './type'

export const balanceAdjustmentApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getAdjustmentType: builder.query<IGetAdjustmentTypeResponse, null>({
			query: data => ({
				url: 'BalanceAdjustment/GetAdjustmentType',
				method: 'POST',
				data,
			}),
		}),
		getReasonList: builder.query<IGetReasonListResponse, IGetReasonListArgs>({
			query: data => ({
				url: 'BalanceAdjustment/GetReasonList',
				method: 'POST',
				data,
			}),
		}),
		// * # 取得客戶資料及主錢包餘額
		getCustInfoWithBalance: builder.query<
			ICustInfoWithBalanceResponse,
			IGetCustInfoWithBalanceArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetCustInfoWithBalance',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 取得調整限額資訊
		getAdjustmentLimitInfo: builder.query<
			IAdjustmentLimitResponse,
			IGetAdjustmentLimitInfoArgs
		>({
			query: data => ({
				url: 'BalanceAdjustment/GetAdjustmentLimitInfo',
				method: 'POST',
				data,
			}),
		}),

		setBalanceAdjustment: builder.mutation<
			IAxiosResponse<null>,
			ISubmitAdjustmentArgs
		>({
			query: data => ({
				url: 'BalanceAdjustment/Submit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setBatchBalanceAdjustment: builder.mutation<
			IAxiosResponse<null>[],
			FormData
		>({
			query: data => ({
				url: 'BalanceAdjustment/SubmitBatch',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 確認密碼，如果調漲金額大於 adjustmentMax 就需再確認一次密碼
		checkPassword: builder.mutation<IAxiosResponse<void>, ICheckPasswordArgs>({
			query: data => ({
				url: 'BalanceAdjustment/CheckPassWord',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useGetAdjustmentTypeQuery,
	useGetReasonListQuery,
	useSetBalanceAdjustmentMutation,
	useLazyGetCustInfoWithBalanceQuery,
	useGetAdjustmentLimitInfoQuery,
	useSetBatchBalanceAdjustmentMutation,
	useCheckPasswordMutation,
} = balanceAdjustmentApi
