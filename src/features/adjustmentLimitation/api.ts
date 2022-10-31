import { rootApi } from 'common/service/rootApi/api'
import {
	IGetAdjustmentListArgs,
	IGetAdjustmentListResponse,
	IUpdateAdjustmentLimitArgs,
} from 'features/adjustmentLimitation/type'

export const adjustmentLimitationApi = rootApi.injectEndpoints({
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
