import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetAdjustmentTypeResponse,
	IGetCustDetailArgs,
	IGetCustDetailResponse,
	IGetReasonListResponse,
	ISubmitAdjustmentArgs,
} from './type'

export const balanceAdjustmentApi = createApi({
	reducerPath: 'balanceAdjustmentApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getAdjustmentType: builder.query<IGetAdjustmentTypeResponse, null>({
			query: data => ({
				url: 'BalanceAdjustment/GetAdjustmentType',
				method: 'POST',
				data,
			}),
		}),
		getReasonList: builder.query<IGetReasonListResponse, null>({
			query: data => ({
				url: 'BalanceAdjustment/GetReasonList',
				method: 'POST',
				data,
			}),
		}),
		getCustDetail: builder.query<IGetCustDetailResponse, IGetCustDetailArgs>({
			query: data => ({
				url: 'CustomerManage/GetCustDetail',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
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
	}),
})

export const {
	useGetAdjustmentTypeQuery,
	useGetReasonListQuery,
	useSetBalanceAdjustmentMutation,
	useLazyGetCustDetailQuery,
	useSetBatchBalanceAdjustmentMutation,
} = balanceAdjustmentApi
