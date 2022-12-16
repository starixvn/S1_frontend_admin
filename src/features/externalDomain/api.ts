import { rootApi } from 'common/service/rootApi/api'
import {
	ICreateDomainArgs,
	ICreateDomainResponse,
	IDeleteDomainArgs,
	IDeleteDomainResponse,
	IGetDomainListArgs,
	IGetDomainListResponse,
	IUpdateDomainArgs,
	IUpdateDomainResponse,
} from 'features/externalDomain/type'

export const externalDomainApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDomainList: builder.query<IGetDomainListResponse, IGetDomainListArgs>({
			query: data => ({
				url: 'Domain/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		createDomain: builder.mutation<ICreateDomainResponse, ICreateDomainArgs>({
			query: data => ({
				url: 'Domain/Create',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateDomain: builder.mutation<IUpdateDomainResponse, IUpdateDomainArgs>({
			query: data => ({
				url: 'Domain/Update',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteDomain: builder.mutation<IDeleteDomainResponse, IDeleteDomainArgs>({
			query: data => ({
				url: 'Domain/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})
export const {
	useLazyGetDomainListQuery,
	useCreateDomainMutation,
	useUpdateDomainMutation,
	useDeleteDomainMutation,
} = externalDomainApi
