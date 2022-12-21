import { rootApi } from 'common/service/rootApi/api'
import {
	ICreateReasonArgs,
	IGetFuncKeysListResponse,
	IGetReasonListArgs,
	IGetReasonListResponse,
	ISetReasonArgs,
} from 'features/reasonManagement/type'

export const reasonManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getFuncKeysList: builder.query<IGetFuncKeysListResponse, null>({
			query: () => ({
				url: 'GetAllData/GetFuncKeyAboutReason',
				method: 'POST',
			}),
		}),
		getReasonList: builder.query<IGetReasonListResponse, IGetReasonListArgs>({
			query: data => ({
				url: 'Reason/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setReason: builder.mutation<void, ISetReasonArgs>({
			query: data => ({
				url: 'Reason/Set',
				method: 'POST',
				data,
			}),
		}),
		createReason: builder.mutation<void, ICreateReasonArgs>({
			query: data => ({
				url: 'Reason/Insert',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetFuncKeysListQuery,
	useLazyGetReasonListQuery,
	useSetReasonMutation,
	useCreateReasonMutation,
} = reasonManagementApi
