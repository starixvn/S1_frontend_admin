import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetPointLevelArgs,
	ICreatePointLevelArgs,
	IUpdatePointLevelArgs,
	IDeletePointLevelArgs,
	IPointLevelResponse,
} from 'features/pointLevelManagement/type'

export const pointLevelManagement = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPointLevelList: builder.query<IPointLevelResponse, IGetPointLevelArgs>({
			query: data => ({
				url: 'PointLevel/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		createPointLevel: builder.mutation<
			IAxiosResponse<null>,
			ICreatePointLevelArgs
		>({
			query: data => ({
				url: 'PointLevel/Create',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updatePointLevel: builder.mutation<
			IAxiosResponse<null>,
			IUpdatePointLevelArgs
		>({
			query: data => ({
				url: 'PointLevel/Update',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deletePointLevel: builder.mutation<
			IAxiosResponse<null>,
			IDeletePointLevelArgs
		>({
			query: data => ({
				url: 'PointLevel/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetPointLevelListQuery,
	useCreatePointLevelMutation,
	useUpdatePointLevelMutation,
	useDeletePointLevelMutation,
} = pointLevelManagement
