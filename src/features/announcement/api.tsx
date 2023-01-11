import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetAnnouncementListArgs,
	IGetAnnouncementByIdArgs,
	IAddAnnouncementArgs,
	IUpdateAnnouncementArgs,
	IDeleteAnnouncementArgs,
	IAnnouncementListData,
	IAnnouncementByIdData,
} from 'features/announcement/type'

export const announcement = rootApi.injectEndpoints({
	endpoints: builder => ({
		getAnnouncementList: builder.query<
			IAxiosResponse<IAnnouncementListData[]>,
			IGetAnnouncementListArgs
		>({
			query: data => ({
				url: 'Announcement/GetAnnouncementList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getAnnouncementById: builder.query<
			IAxiosResponse<IAnnouncementByIdData>,
			IGetAnnouncementByIdArgs
		>({
			query: data => ({
				url: 'Announcement/GetAnnouncementById',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		addAnnouncement: builder.mutation<
			IAxiosResponse<null>,
			IAddAnnouncementArgs
		>({
			query: data => ({
				url: 'Announcement/AddAnnouncement',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateAnnouncement: builder.mutation<
			IAxiosResponse<null>,
			IUpdateAnnouncementArgs
		>({
			query: data => ({
				url: 'Announcement/UpdateAnnouncement',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteAnnouncement: builder.mutation<
			IAxiosResponse<null>,
			IDeleteAnnouncementArgs
		>({
			query: data => ({
				url: 'Announcement/DeleteAnnouncement',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetAnnouncementListQuery,
	useGetAnnouncementByIdQuery,
	useAddAnnouncementMutation,
	useUpdateAnnouncementMutation,
	useDeleteAnnouncementMutation,
} = announcement
