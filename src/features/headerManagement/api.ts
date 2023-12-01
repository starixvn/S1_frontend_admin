import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetHeaderSettingArgs,
	IHeaderSettingResponse,
	IUpdateSortArgs,
	ILobbyCategoryData,
	IGetHeaderSettingGroupByTpGameIdNoArgs,
	HeaderSettingGroupByTpGameIdNoResponse,
	IUpdateHeaderSettingByTpGameIdArgs,
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
		getHeaderSettingGroupByTpGameIdNoList: builder.query<
			HeaderSettingGroupByTpGameIdNoResponse,
			IGetHeaderSettingGroupByTpGameIdNoArgs
		>({
			query: data => ({
				url: 'HeaderManagement/GetHeaderSettingGroupByTpGameIdNo',
				method: 'POST',
				data,
			}),
			providesTags: ['UPDATE_MODAL'],
		}),
		updateHeaderSettingByTpGameId: builder.mutation<
			IAxiosResponse<null>,
			IUpdateHeaderSettingByTpGameIdArgs
		>({
			query: data => ({
				url: 'HeaderManagement/UpdateHeaderSettingByTpGameId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['UPDATE_MODAL'],
		}),
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
	}),
})

export const {
	useLazyGetHeaderSettingListQuery,
	useGetHeaderSettingGroupByTpGameIdNoListQuery,
	useUpdateHeaderSettingByTpGameIdMutation,
	useGetLobbyCategoryQuery,
	useUpdateHeaderManagementSortMutation,
} = headerManagementApi
