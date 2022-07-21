import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetSpecialPasswordArg,
	IGetSpecialPasswordResponse,
	ISetSpecialPasswordArgs,
} from 'features/specialPasswordManagement/type'

export const specialPasswordApi = createApi({
	reducerPath: 'specialPasswordApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getPassword: builder.query<
			IGetSpecialPasswordResponse,
			IGetSpecialPasswordArg
		>({
			query: data => ({
				url: 'AdjustmentPassword/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setPassword: builder.mutation<void, ISetSpecialPasswordArgs>({
			query: data => ({
				url: 'AdjustmentPassword/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useGetPasswordQuery, useSetPasswordMutation } =
	specialPasswordApi
