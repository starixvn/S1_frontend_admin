import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetInactivePointExpirySettingArg,
	IGetInactivePointExpirySettingResponse,
	ISetInactivePointExpirySettingArgs,
} from './type'

export const inactivePointExpiryApi = createApi({
	reducerPath: 'inactivePointExpiryApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getInactivePointExpirySetting: builder.query<
			IGetInactivePointExpirySettingResponse,
			IGetInactivePointExpirySettingArg
		>({
			query: data => ({
				url: `PointSetting/GetInactivePointExpirySetting`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setInactivePointExpirySetting: builder.mutation<
			void,
			ISetInactivePointExpirySettingArgs
		>({
			query: data => ({
				url: `PointSetting/SetInactivePointExpirySetting`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetInactivePointExpirySettingQuery,
	useSetInactivePointExpirySettingMutation,
} = inactivePointExpiryApi
