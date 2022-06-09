import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from '../Api'
import { axiosBaseQuery, IAxiosResponse } from '../axiosBaseQuery'

export const homeApi = createApi({
	reducerPath: 'homeApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		checkBrand: builder.query<IAxiosResponse<number>, void>({
			query: data => ({
				url: 'Home/CheckBrand',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		changeBrand: builder.mutation<IAxiosResponse<number>, { siteId: number }>({
			query: data => ({
				url: 'Home/ChangeBrand',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useCheckBrandQuery, useChangeBrandMutation } = homeApi
