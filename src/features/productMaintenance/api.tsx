import { rootApi } from 'common/service/rootApi/api'

import {
	IGetTpMaintenanceArgs,
	IAddTpMaintenanceArgs,
	IUpdateTpMaintenanceArgs,
	IDeleteTpMaintenanceArgs,
	ITpMaintenanceResponse,
} from 'features/productMaintenance/type'

const productMaintenanceApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getTpMaintenanceList: builder.query<
			ITpMaintenanceResponse,
			IGetTpMaintenanceArgs
		>({
			query: data => ({
				url: 'TpMaintenance/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		addTpMaintenance: builder.mutation<void, IAddTpMaintenanceArgs>({
			query: data => ({
				url: 'TpMaintenance/Create',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateTpMaintenance: builder.mutation<void, IUpdateTpMaintenanceArgs>({
			query: data => ({
				url: 'TpMaintenance/Update',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteTpMaintenance: builder.mutation<void, IDeleteTpMaintenanceArgs>({
			query: data => ({
				url: 'TpMaintenance/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetTpMaintenanceListQuery,
	useAddTpMaintenanceMutation,
	useUpdateTpMaintenanceMutation,
	useDeleteTpMaintenanceMutation,
} = productMaintenanceApi
