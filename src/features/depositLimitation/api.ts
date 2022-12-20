import { rootApi } from 'common/service/rootApi/api'
import {
	ICreateDepositLimitArgs,
	IDeleteDepositLimitArgs,
	IGetDepositLimitArgs,
	IGetDepositLimitResponse,
	IUpdateDepositLimitArgs,
} from 'features/depositLimitation/type'

export const depositLimitationApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositLimitList: builder.query<
			IGetDepositLimitResponse,
			IGetDepositLimitArgs
		>({
			query: data => ({
				url: 'DepositLimit/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		updateDepositLimit: builder.mutation<void, IUpdateDepositLimitArgs>({
			query: data => ({
				url: 'DepositLimit/Update',
				method: 'POST',
				data,
			}),
		}),
		createDepositLimit: builder.mutation<void, ICreateDepositLimitArgs>({
			query: data => ({
				url: 'DepositLimit/Create',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteDepositLimit: builder.mutation<void, IDeleteDepositLimitArgs>({
			query: data => ({
				url: 'DepositLimit/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetDepositLimitListQuery,
	useUpdateDepositLimitMutation,
	useCreateDepositLimitMutation,
	useDeleteDepositLimitMutation,
} = depositLimitationApi
