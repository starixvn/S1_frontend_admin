import { rootApi } from 'common/service/rootApi/api'
import {
	IGetRedemptionLimitArg,
	IGetRedemptionLimitResponse,
	ISetRedemptionLimitArgs,
} from './type'

export const redemptionLimitApi = rootApi.injectEndpoints({
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
