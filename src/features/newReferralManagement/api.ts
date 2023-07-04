import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetDepositReferralArgs,
	IDepositReferralResponse,
	ISetDepositReferralArgs,
	IUpdateDepositReferralStatusArgs,
	IGetDepositReferralDetailArgs,
	IDepositReferralDetailResponse,
} from 'features/newReferralManagement/type'

export const newReferralManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositReferralList: builder.query<
			IDepositReferralResponse,
			IGetDepositReferralArgs
		>({
			query: data => ({
				url: 'DepositReferral/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getDepositReferralDetail: builder.query<
			IDepositReferralDetailResponse,
			IGetDepositReferralDetailArgs
		>({
			query: data => ({
				url: 'DepositReferral/Get',
				method: 'POST',
				data,
			}),
		}),
		setDepositReferral: builder.mutation<
			IAxiosResponse<null>,
			ISetDepositReferralArgs
		>({
			query: data => ({
				url: 'DepositReferral/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateDepositReferralStatus: builder.mutation<
			IAxiosResponse<null>,
			IUpdateDepositReferralStatusArgs
		>({
			query: data => ({
				url: 'DepositReferral/UpdateStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetDepositReferralListQuery,
	useLazyGetDepositReferralDetailQuery,
	useSetDepositReferralMutation,
	useUpdateDepositReferralStatusMutation,
} = newReferralManagementApi
