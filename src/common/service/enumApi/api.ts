import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import { IEnumTypeResponse, IGetEnumTypeArgs } from './type'

export const enumApi = createApi({
	reducerPath: 'enumApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getEnumType: builder.query<IEnumTypeResponse, IGetEnumTypeArgs>({
			query: data => ({
				url: 'Enum/GetEnumType',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useGetEnumTypeQuery } = enumApi
