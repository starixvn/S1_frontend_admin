import { createApi } from '@reduxjs/toolkit/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	AddReferralArgs,
	IGetReferralResponse,
	IGetReferralsResponse,
} from './type'

export const referralManagementApi = createApi({
	reducerPath: 'referralManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
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
