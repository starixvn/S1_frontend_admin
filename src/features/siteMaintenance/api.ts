import { rootApi } from 'common/service/rootApi/api'
import {
	IGetMaintenanceArg,
	IGetMaintenanceResponse,
	ISetMaintenanceArgs,
} from './type'

export const siteMaintenanceApi = rootApi.injectEndpoints({
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
