import { rootApi } from 'common/service/rootApi/api'
import {
	IGetVideoListArgs,
	IGetVideoListResponse,
	IUpdateVideoArgs,
	IUpdateVideoResponse,
} from 'features/videoManagement/type'

export const videoManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getVideoList: builder.query<IGetVideoListResponse, IGetVideoListArgs>({
			query: data => ({
				url: 'Video/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		updateVideo: builder.mutation<IUpdateVideoResponse, IUpdateVideoArgs>({
			query: data => ({
				url: 'Video/Update',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useLazyGetVideoListQuery, useUpdateVideoMutation } =
	videoManagementApi
