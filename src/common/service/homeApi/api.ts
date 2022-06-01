import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from '../Api'
import { axiosBaseQuery, IAxiosResponse } from '../axiosBaseQuery'

export const homeApi = createApi({
	reducerPath: 'homeApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: builder => ({
		checkBrand: builder.query<IAxiosResponse<number>, void>({
			query: data => ({
				url: 'Home/CheckBrand',
				method: 'POST',
				data,
			}),
		}),
		changeBrand: builder.mutation<IAxiosResponse<number>, { siteId: number }>({
			query: data => ({
				url: 'Home/ChangeBrand',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useCheckBrandQuery, useChangeBrandMutation } = homeApi
