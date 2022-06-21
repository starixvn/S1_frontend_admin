import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetTpCategoryArg,
	IGetTpCategoryResponse,
	IGetTurnoverPointSettingArgs,
	IGetTurnoverPointSettingListArgs,
	IGetTurnoverPointSettingListResponse,
	IGetTurnoverPointSettingResponse,
	IGetTurnoverPointStatusSettingArgs,
	IGetTurnoverPointStatusSettingResponse,
	ISetTurnoverPointSettingArgs,
	ISetTurnoverPointStatusSettingArgs,
} from './type'

export const turnoverPointApi = createApi({
	reducerPath: 'turnoverPointApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getCategory: builder.query<IGetTpCategoryResponse, IGetTpCategoryArg>({
			query: data => ({
				url: 'BaseData/GetTpCategoryList',
				method: 'POST',
				data,
			}),
		}),
		getTurnoverPointSettingList: builder.query<
			IGetTurnoverPointSettingListResponse,
			IGetTurnoverPointSettingListArgs
		>({
			query: data => ({
				url: 'PointSetting/GetTurnoverPointSettingList',
				method: 'POST',
				data,
			}),
		}),
		getTurnoverPointSetting: builder.query<
			IGetTurnoverPointSettingResponse,
			IGetTurnoverPointSettingArgs
		>({
			query: data => ({
				url: 'PointSetting/GetTurnoverPointSetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setTurnoverPointSetting: builder.mutation<
			void,
			ISetTurnoverPointSettingArgs
		>({
			query: data => ({
				url: 'PointSetting/SetTurnoverPointSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getTurnoverPointStatusSetting: builder.query<
			IGetTurnoverPointStatusSettingResponse,
			IGetTurnoverPointStatusSettingArgs
		>({
			query: data => ({
				url: 'GetTurnoverPointStatusSetting',
				method: 'POST',
				data,
			}),
		}),
		setTurnoverPointStatusSetting: builder.mutation<
			void,
			ISetTurnoverPointStatusSettingArgs
		>({
			query: data => ({
				url: 'SetTurnoverPointStatusSetting',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useGetCategoryQuery,
	useLazyGetTurnoverPointSettingListQuery,
	useLazyGetTurnoverPointSettingQuery,
	useSetTurnoverPointSettingMutation,
	useLazyGetTurnoverPointStatusSettingQuery,
	useSetTurnoverPointStatusSettingMutation,
} = turnoverPointApi
