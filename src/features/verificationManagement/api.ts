import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetVerificationRewardArgs,
	IGetVerificationRewardResponse,
	ISetVerificationRewardArgs,
	IUpdateStatusArgs,
} from 'features/verificationManagement/type'

export const verificationManagementApi = createApi({
	reducerPath: 'verificationManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getVerificationReward: builder.query<
			IGetVerificationRewardResponse,
			IGetVerificationRewardArgs
		>({
			query: data => ({
				url: 'VerificationReward/Get',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setVerificationStatus: builder.mutation<void, IUpdateStatusArgs>({
			query: data => ({
				url: 'VerificationReward/UpdateStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setVerificationReward: builder.mutation<void, ISetVerificationRewardArgs>({
			query: data => ({
				url: 'VerificationReward/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetVerificationRewardQuery,
	useSetVerificationRewardMutation,
	useSetVerificationStatusMutation,
} = verificationManagementApi
