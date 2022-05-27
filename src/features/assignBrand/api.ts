import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import { AssignBrandResponse } from './type'

export const assignBrandApi = createApi({
	reducerPath: 'assignBrandApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getAssignBrand: builder.query<
			AssignBrandResponse,
			{
				userName: string
				selectSites: number[]
			}
		>({
			query: ({ userName, selectSites }) => ({
				url: 'Permission/GetAssignBrand',
				method: 'POST',
				data: {
					userName,
					selectSite: selectSites,
				},
			}),
			providesTags: ['POST'],
		}),
		getUserBrand: builder.query<
			IAxiosResponse<{ siteId: number; siteName: string }[]>,
			void
		>({
			query: () => ({
				url: 'Permission/GetUserBrand',
				method: 'POST',
			}),
		}),
		setAdminBrand: builder.mutation<
			void,
			{
				siteId: number
				userId?: number
				status: number
			}
		>({
			query: data => ({
				url: 'Permission/SetAdminBrand',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetAssignBrandQuery,
	useGetUserBrandQuery,
	useSetAdminBrandMutation,
} = assignBrandApi
