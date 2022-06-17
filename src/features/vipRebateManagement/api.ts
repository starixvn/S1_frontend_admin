import { createApi } from '@reduxjs/toolkit/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetPeriodArgs,
	IGetRebateGameTypeListArgs,
	IGetRebateGameTypeListResponse,
	IGetRebateInfoArgs,
	IGetRebateInfoResponse,
	ISetCategoryArgs,
	ISetBatchGameTypeArgs,
	ISetPayoutLimitArgs,
	ISetPeriodArgs,
	IGetPeriodResponse,
} from './type'

export const vipRebateManagementApi = createApi({
	reducerPath: 'vipRebateManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getPeriodArgs: builder.query<IGetPeriodResponse, IGetPeriodArgs>({
			query: data => ({
				url: 'RebateForVip/GetPeriod',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),

		setPeriodType: builder.mutation<void, ISetPeriodArgs>({
			query: data => ({
				url: 'RebateForVip/SetPeriod',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),

		getRebateInfo: builder.query<IGetRebateInfoResponse, IGetRebateInfoArgs>({
			query: data => ({
				url: 'RebateForVip/GetRebateInfo',
				method: 'POST',
				data,
			}),
		}),
		setCategory: builder.mutation<void, ISetCategoryArgs>({
			query: data => ({
				url: 'RebateForVip/SetCategory',
				method: 'POST',
				data,
			}),
		}),

		setPayoutLimit: builder.mutation<void, ISetPayoutLimitArgs>({
			query: data => ({
				url: 'RebateForVip/SetPayoutLimit',
				method: 'POST',
				data,
			}),
		}),
		// get setByProduct Page info
		getRebateGameTypeList: builder.query<
			IGetRebateGameTypeListResponse,
			IGetRebateGameTypeListArgs
		>({
			query: data => ({
				url: 'RebateForVip/GetRebateGameTypeList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// setByProduct
		setBatchGameType: builder.mutation<void, ISetBatchGameTypeArgs>({
			query: data => ({
				url: 'RebateForVip/BatchSetGameType',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetPeriodArgsQuery,
	useSetPeriodTypeMutation,
	useLazyGetRebateInfoQuery,
	useLazyGetRebateGameTypeListQuery,
	useSetCategoryMutation,
	useSetBatchGameTypeMutation,
	useSetPayoutLimitMutation,
} = vipRebateManagementApi
