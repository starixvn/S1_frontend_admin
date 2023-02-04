import { rootApi } from 'common/service/rootApi/api'

import {
	IGetTpGameTypeArgs,
	IGetTpMaintenanceArgs,
	IAddTpMaintenanceArgs,
	IUpdateTpMaintenanceArgs,
	IDeleteTpMaintenanceArgs,
	ITpMaintenanceResponse,
	ITpGameTypeResponse,
} from 'features/productMaintenance/type'

const productMaintenanceApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getTpGameType: builder.query<ITpGameTypeResponse, IGetTpGameTypeArgs>({
			query: data => ({
				url: 'TpMaintenance/GetTpGameType',
				method: 'POST',
				data,
			}),
		}),
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
	useGetTpGameTypeQuery,
	useLazyGetTpMaintenanceListQuery,
	useAddTpMaintenanceMutation,
	useUpdateTpMaintenanceMutation,
	useDeleteTpMaintenanceMutation,
} = productMaintenanceApi
