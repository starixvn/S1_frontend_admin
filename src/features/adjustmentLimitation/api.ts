import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetAdjustmentListArgs,
	IGetAdjustmentListResponse,
	IUpdateAdjustmentLimitArgs,
} from 'features/adjustmentLimitation/type'

export const adjustmentLimitationApi = createApi({
	reducerPath: 'adjustmentLimitationApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: builder => ({
		getAdjustmentLimitList: builder.query<
			IGetAdjustmentListResponse,
			IGetAdjustmentListArgs
		>({
			query: data => ({
				url: 'adjustmentLimit/GetList',
				method: 'POST',
				data,
			}),
		}),
		updateAdjustmentLimit: builder.mutation<void, IUpdateAdjustmentLimitArgs>({
			query: data => ({
				url: 'adjustmentLimit/set',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetAdjustmentLimitListQuery,
	useUpdateAdjustmentLimitMutation,
} = adjustmentLimitationApi
