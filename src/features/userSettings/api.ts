import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	AddAdminUserArgs,
	AdminUserInterface,
	AdminUserPermissionInterface,
	ISetAdminUserPasswordArgs,
	ISetAdminUserStatusArgs,
	UpdateAdminUserArgs,
	UserAdminState,
} from './type'

export const userSettingsApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getUserAdminListByUserName: builder.query<
			IAxiosResponse<UserAdminState[]>,
			{ userName: string; siteId?: number }
		>({
			query: data => ({
				url: `Permission/GetAdminUserList`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getAddAdminUserCurrency: builder.query<
			IAxiosResponse<any[]>,
			{
				siteId?: number
			}
		>({
			query: data => ({
				url: `Permission/GetAddAdminUserCurrency`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getOriginAdminPermissionListByRole: builder.query<
			AdminUserPermissionInterface[],
			{ role: number; siteId?: number }
		>({
			query: data => ({
				url: `Permission/GetAddAdminUser`,
				method: 'POST',
				data,
			}),
			transformResponse: (response: {
				data: { permission: AdminUserPermissionInterface[] }
			}) => response.data?.permission ?? [],
		}),
		addAdminUser: builder.mutation<any, AddAdminUserArgs>({
			query: data => ({
				url: `Permission/AddAdminUser`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getUpdateAdminUser: builder.query<
			IAxiosResponse<AdminUserInterface>,
			{ userId: number; siteId?: number }
		>({
			query: data => ({
				url: `Permission/GetUpdateAdminUser`,
				method: 'POST',
				data,
			}),
		}),
		updateAdminUser: builder.mutation<void, UpdateAdminUserArgs>({
			query: data => ({
				url: `Permission/UpdateAdminUser`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteAdminUserByUserId: builder.mutation<
			void,
			{
				userId: number
				siteId?: number
			}
		>({
			query: data => ({
				url: `Permission/DeleteAdminUser`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setAdminUserStatus: builder.mutation<void, ISetAdminUserStatusArgs>({
			query: data => ({
				url: `Permission/SetAdminUserStatus`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setAdminUserPassword: builder.mutation<void, ISetAdminUserPasswordArgs>({
			query: data => ({
				url: `Permission/SetAdminUserPassword`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetAddAdminUserCurrencyQuery,
	useLazyGetOriginAdminPermissionListByRoleQuery,
	useLazyGetUserAdminListByUserNameQuery,
	useLazyGetUpdateAdminUserQuery,
	useUpdateAdminUserMutation,
	useDeleteAdminUserByUserIdMutation,
	useAddAdminUserMutation,
	useSetAdminUserStatusMutation,
	useSetAdminUserPasswordMutation,
} = userSettingsApi
