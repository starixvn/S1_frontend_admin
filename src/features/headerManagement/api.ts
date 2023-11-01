import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetHeaderSettingArgs,
	IHeaderSettingResponse,
	IUpdateSortArgs,
	ILobbyCategoryData,
	IUpdateHeaderStatusArgs,
} from 'features/headerManagement/type'

export const headerManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getHeaderSettingList: builder.query<
			IHeaderSettingResponse,
			IGetHeaderSettingArgs
		>({
			query: data => ({
				url: 'HeaderManagement/GetHeaderSetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getLobbyCategory: builder.query<IAxiosResponse<ILobbyCategoryData[]>, null>(
			{
				query: () => ({
					url: 'HeaderManagement/GetLobbyCategory',
					method: 'POST',
				}),
			}
		),
		updateHeaderManagementSort: builder.mutation<
			IAxiosResponse<null>,
			IUpdateSortArgs
		>({
			query: data => ({
				url: 'HeaderManagement/UpdateSort',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateHeaderStatus: builder.mutation<
			IAxiosResponse<null>,
			IUpdateHeaderStatusArgs
		>({
			query: data => ({
				url: 'HeaderManagement/UpdateHeaderStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetHeaderSettingListQuery,
	useGetHeaderSettingListQuery,
	useGetLobbyCategoryQuery,
	useUpdateHeaderManagementSortMutation,
	useUpdateHeaderStatusMutation,
} = headerManagementApi
