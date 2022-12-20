import { rootApi } from 'common/service/rootApi/api'
import {
	IGetVerificationRewardArgs,
	IGetVerificationRewardResponse,
	ISetVerificationRewardArgs,
	IUpdateStatusArgs,
} from 'features/verificationManagement/type'

export const verificationManagementApi = rootApi.injectEndpoints({
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
