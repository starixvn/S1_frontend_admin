import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IAddCustNoteArgs,
	IDeleteCustPhotoIdArgs,
	IGetBasicInfoArgs,
	IGetBasicInfoResponse,
	IGetCustNotesArgs,
	IGetCustNotesResponse,
	IGetCustPhotoIdArgs,
	IGetCustPhotoResponse,
	IGetReferralHistoryArgs,
	IGetReferralHistoryResponse,
	IGetVipLevelLogArgs,
	IGetVipLevelLogResponse,
	ISetCustNoteArgs,
} from 'features/memberProfile/type'

export const memberProfileApi = createApi({
	reducerPath: 'memberProfileApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['EditPhoto', 'BasicInfoMutation', 'SetCustomerNote'],
	endpoints: builder => ({
		// sider基本資料
		getBasicInfo: builder.query<IGetBasicInfoResponse, IGetBasicInfoArgs>({
			query: data => ({
				url: 'Member/GetBasicInfo',
				method: 'POST',
				data,
			}),
			providesTags: ['BasicInfoMutation'],
		}),
		// sider 內 custPhoto
		getCustPhoto: builder.query<IGetCustPhotoResponse, IGetCustPhotoIdArgs>({
			query: data => ({
				url: 'Member/GetCustPhotoId',
				method: 'POST',
				data,
			}),
			providesTags: ['EditPhoto'],
		}),
		// 刪除 sider 內 custPhoto (單張)
		deleteCustPhoto: builder.mutation<void, IDeleteCustPhotoIdArgs>({
			query: data => ({
				url: 'Member/DeleteCustPhotoId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['EditPhoto'],
		}),
		// 上傳 sider 內 custPhoto (單張)
		uploadCustPhoto: builder.mutation<void, FormData>({
			query: data => ({
				url: 'Member/UploadCustPhotoId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['EditPhoto'],
		}),
		// 取消 Line 綁定
		lineUnbind: builder.mutation<void, IGetBasicInfoArgs>({
			query: data => ({
				url: 'Member/LineUnbind',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		// 取得 VipLevel Log 頁面資料
		getVipLevelLog: builder.query<IGetVipLevelLogResponse, IGetVipLevelLogArgs>(
			{
				query: data => ({
					url: 'customerManage/GetVipLevelLogByCustId',
					method: 'POST',
					data,
				}),
			}
		),
		// CustomerInfo => ReferralHistory 頁面
		getReferralHistoryLog: builder.query<
			IGetReferralHistoryResponse,
			IGetReferralHistoryArgs
		>({
			query: data => ({
				url: 'customerManage/GetRefFriendByCustId',
				method: 'POST',
				data,
			}),
		}),
		// CustomerInfo => Notes 頁面
		getCustNotes: builder.query<IGetCustNotesResponse, IGetCustNotesArgs>({
			query: data => ({
				url: 'customerManage/GetCustNote',
				method: 'POST',
				data,
			}),
			providesTags: ['SetCustomerNote'],
		}),
		addCustNotes: builder.mutation<void, IAddCustNoteArgs>({
			query: data => ({
				url: 'customerManage/AddCustNote',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetCustomerNote'],
		}),
		setCustNotes: builder.mutation<void, ISetCustNoteArgs>({
			query: data => ({
				url: 'customerManage/SetCustNote',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetCustomerNote'],
		}),
	}),
})

export const {
	useGetBasicInfoQuery,
	useGetCustPhotoQuery,
	useDeleteCustPhotoMutation,
	useUploadCustPhotoMutation,
	useLineUnbindMutation,
	useLazyGetVipLevelLogQuery,
	useLazyGetReferralHistoryLogQuery,
	useLazyGetCustNotesQuery,
	useAddCustNotesMutation,
	useSetCustNotesMutation,
} = memberProfileApi
