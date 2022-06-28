import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from '../Api'
import { axiosBaseQuery, IAxiosResponse } from '../axiosBaseQuery'

export const permissionApi = createApi({
	reducerPath: 'permissionApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: builder => ({
		getLanguageList: builder.query<
			IAxiosResponse<string[]>,
			{ siteId?: number; currencyId: number }
		>({
			query: data => ({
				url: 'Permission/GetLanguageList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useGetLanguageListQuery } = permissionApi
