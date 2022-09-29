import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IDeleteCustPhotoIdArgs,
	IGetBasicInfoArgs,
	IGetBasicInfoResponse,
	IGetCustPhotoIdArgs,
	IGetCustPhotoResponse,
} from 'features/memberProfile/type'

export const memberProfileApi = createApi({
	reducerPath: 'memberProfileApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['EditPhoto'],
	endpoints: builder => ({
		getBasicInfo: builder.query<IGetBasicInfoResponse, IGetBasicInfoArgs>({
			query: data => ({
				url: 'Member/GetBasicInfo',
				method: 'POST',
				data,
			}),
		}),
		getCustPhoto: builder.query<IGetCustPhotoResponse, IGetCustPhotoIdArgs>({
			query: data => ({
				url: 'Member/GetCustPhotoId',
				method: 'POST',
				data,
			}),
			providesTags: ['EditPhoto'],
		}),
		deleteCustPhoto: builder.mutation<void, IDeleteCustPhotoIdArgs>({
			query: data => ({
				url: 'Member/DeleteCustPhotoId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['EditPhoto'],
		}),
		uploadCustPhoto: builder.mutation<void, FormData>({
			query: data => ({
				url: 'Member/UploadCustPhotoId',
				method: 'POST',
				data,
				headers: {
					'content-type':
						'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
				},
			}),
			invalidatesTags: ['EditPhoto'],
		}),
	}),
})

export const {
	useGetBasicInfoQuery,
	useGetCustPhotoQuery,
	useDeleteCustPhotoMutation,
	useUploadCustPhotoMutation,
} = memberProfileApi
