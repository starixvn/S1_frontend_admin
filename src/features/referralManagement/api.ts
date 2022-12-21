import { rootApi } from 'common/service/rootApi/api'
import {
	AddReferralArgs,
	IGetReferralResponse,
	IGetReferralsResponse,
} from './type'

export const referralManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getReferral: builder.query<
			IGetReferralResponse,
			{ siteId: number | undefined; currencyId: number }
		>({
			query: data => ({
				url: 'Referral/Get',
				method: 'POST',
				data,
			}),
		}),
		getReferrals: builder.query<IGetReferralsResponse, number | undefined>({
			query: siteId => ({
				url: 'Referral/GetList',
				method: 'POST',
				data: { siteId },
			}),
			providesTags: ['POST'],
		}),
		setReferral: builder.mutation<void, AddReferralArgs>({
			query: data => ({
				url: 'Referral/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateReferralStatus: builder.mutation<
			void,
			{
				siteId?: number
				currencyId: number
				status: boolean
			}
		>({
			query: data => ({
				url: 'Referral/UpdateStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetReferralQuery,
	useGetReferralsQuery,
	useSetReferralMutation,
	useUpdateReferralStatusMutation,
} = referralManagementApi
