import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetRedemptionLimitArg,
	IGetRedemptionLimitResponse,
	ISetRedemptionLimitArgs,
} from './type'

export const redemptionLimitApi = createApi({
	reducerPath: 'redemptionLimitApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getRedemptionLimit: builder.query<
			IGetRedemptionLimitResponse,
			IGetRedemptionLimitArg
		>({
			query: data => ({
				url: 'GiftManagement/GetRedemptionLimit',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setRedemptionLimit: builder.mutation<void, ISetRedemptionLimitArgs>({
			query: data => ({
				url: 'GiftManagement/SetRedemptionLimit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useGetRedemptionLimitQuery, useSetRedemptionLimitMutation } =
	redemptionLimitApi
