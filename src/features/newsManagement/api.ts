import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetNewsListArgs,
	INewsData,
	IGetNewsByIdArgs,
	ISetNewsArgs,
	ISetNewsStatusArgs,
} from 'features/newsManagement/type'
import { IPostUploadImageResponse } from 'features/bannerManagement/api'

const newsManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getNewsList: builder.query<IAxiosResponse<INewsData[]>, IGetNewsListArgs>({
			query: data => ({
				url: 'News/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getNewsById: builder.query<IAxiosResponse<INewsData>, IGetNewsByIdArgs>({
			query: data => ({
				url: 'News/GetById',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setNews: builder.mutation<IAxiosResponse<void>, ISetNewsArgs>({
			query: data => ({
				url: 'News/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setNewsStatus: builder.mutation<IAxiosResponse<void>, ISetNewsStatusArgs>({
			query: data => ({
				url: 'News/SetStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		uploadNewsImage: builder.mutation<IPostUploadImageResponse, FormData>({
			query: data => ({
				url: 'UploadImage/NewsManagement',
				method: 'POST',
				data,
				headers: {
					'content-type':
						'multipart/form-data; boundary=<calculated when request is sent>',
				},
			}),
		}),
	}),
})

export const {
	useLazyGetNewsListQuery,
	useGetNewsByIdQuery,
	useSetNewsMutation,
	useSetNewsStatusMutation,
	useUploadNewsImageMutation,
} = newsManagementApi
