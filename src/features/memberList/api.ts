import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetCategoryResponse,
	IGetMemberListArgs,
	IGetMemberListResponse,
	IGetMemberRewardPointLogArgs,
	IGetMemberRewardPointLogResponse,
	IGetVipLevelSettingArg,
	IGetVipLevelSettingResponse,
	IManualRewardPointArgs,
} from './type'

export const memberListApi = createApi({
	reducerPath: 'memberListApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getMemberList: builder.query<IGetMemberListResponse, IGetMemberListArgs>({
			query: data => ({
				url: 'StorePoint/GetMemberList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getMemberRewardPointLog: builder.query<
			IGetMemberRewardPointLogResponse,
			IGetMemberRewardPointLogArgs
		>({
			query: data => ({
				url: 'StorePoint/GetMemberRewardPointLog',
				method: 'POST',
				data,
			}),
		}),
		setManualRewardPoint: builder.mutation<void, IManualRewardPointArgs>({
			query: data => ({
				url: 'StorePoint/ManualRewardPoint',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getVipLevel: builder.query<
			IGetVipLevelSettingResponse,
			IGetVipLevelSettingArg
		>({
			query: data => ({
				url: 'BaseData/GetVipLevelSettingBySiteId',
				method: 'POST',
				data,
			}),
		}),
		getCategoryList: builder.query<IGetCategoryResponse, null>({
			query: data => ({
				url: 'StorePoint/GetManualRewardPointCategoryType',
				method: 'POST',
				data,
			}),
		}),
		getSampleFile: builder.mutation<Blob, null>({
			query: data => ({
				url: 'StorePoint/GetSampleExcelFile',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		uploadBatchPoint: builder.mutation<void, FormData>({
			query: data => ({
				url: 'StorePoint/BatchManualRewardPoint',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useUploadBatchPointMutation,
	useGetSampleFileMutation,
	useGetCategoryListQuery,
	useGetVipLevelQuery,
	useLazyGetMemberListQuery,
	useLazyGetMemberRewardPointLogQuery,
	useSetManualRewardPointMutation,
} = memberListApi
