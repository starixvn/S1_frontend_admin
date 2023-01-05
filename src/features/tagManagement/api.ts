import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetTagArgs,
	IEditTagArgs,
	ISetTagStatus,
	IGetTagListData,
	ICreateTagArgs,
} from 'features/tagManagement/type'

export const tagManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getTagList: builder.query<IAxiosResponse<IGetTagListData[]>, IGetTagArgs>({
			query: data => ({
				url: 'TagManagement/GetTagList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setTagStatus: builder.mutation<IAxiosResponse<null>, ISetTagStatus>({
			query: data => ({
				url: 'TagManagement/SetTagStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// 這裡Edit and Create 同支api, 為了區分用不同型回傳
		editTag: builder.mutation<
			IAxiosResponse<null>,
			IEditTagArgs | ICreateTagArgs
		>({
			query: data => ({
				url: 'TagManagement/EditTagManagement',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetTagListQuery,
	useEditTagMutation,
	useSetTagStatusMutation,
} = tagManagementApi
