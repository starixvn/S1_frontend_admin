import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetMaintenanceArg,
	IGetMaintenanceResponse,
	ISetMaintenanceArgs,
} from './type'

export const siteMaintenanceApi = createApi({
	reducerPath: 'siteMaintenanceApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getMaintenance: builder.query<IGetMaintenanceResponse, IGetMaintenanceArg>({
			query: data => ({
				url: 'SiteMaintenance/Get',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setMaintenance: builder.mutation<void, ISetMaintenanceArgs>({
			query: data => ({
				url: 'SiteMaintenance/Update',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useGetMaintenanceQuery, useSetMaintenanceMutation } =
	siteMaintenanceApi
