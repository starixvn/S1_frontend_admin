import { createApi } from '@reduxjs/toolkit/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	AddAdminUserArgs,
	AdminUserInterface,
	AdminUserPermissionInterface,
	UpdateAdminUserArgs,
	UserAdminState,
} from './type'

export const userSettingsApi = createApi({
	reducerPath: 'userSettingsApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getUserAdminListByUserName: builder.query<UserAdminState[], string>({
			query: userName => ({
				url: `Permission/GetAdminUserList`,
				method: 'POST',
				data: { userName },
			}),
			providesTags: ['POST'],
		}),
		getAddAdminUserCurrency: builder.query<any[], unknown>({
			query: () => ({
				url: `Permission/GetAddAdminUserCurrency`,
				method: 'POST',
			}),
			providesTags: ['POST'],
		}),
		getOriginAdminPermissionListByRole: builder.query<
			AdminUserPermissionInterface[],
			number
		>({
			query: role => ({
				url: `Permission/GetAddAdminUser`,
				method: 'POST',
				data: { role },
			}),
			transformResponse: (response: {
				permission: AdminUserPermissionInterface[]
			}) => response?.permission ?? [],
		}),
		addAdminUser: builder.mutation<any, AddAdminUserArgs>({
			query: data => ({
				url: `Permission/AddAdminUser`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getUpdateAdminUser: builder.query<AdminUserInterface, number>({
			query: userId => ({
				url: `Permission/GetUpdateAdminUser`,
				method: 'POST',
				data: { userId },
			}),
		}),
		updateAdminUser: builder.mutation<any, UpdateAdminUserArgs>({
			query: data => ({
				url: `Permission/UpdateAdminUser`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteAdminUserByUserId: builder.mutation<any, number>({
			query: userId => ({
				url: `Permission/DeleteAdminUser`,
				method: 'POST',
				data: { userId },
			}),
			invalidatesTags: ['POST'],
		}),
		setAdminUserStatus: builder.mutation<
			any,
			{ userId: number; siteId?: number; status: number }
		>({
			query: data => ({
				url: `Permission/SetAdminUserStatus`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setAdminUserPassword: builder.mutation<
			any,
			{ userId: number; siteId?: number; password: any }
		>({
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
