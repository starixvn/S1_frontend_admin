import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import { AssignBrandResponse } from './type'

export const assignBrandApi = rootApi.injectEndpoints({
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
