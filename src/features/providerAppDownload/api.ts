import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetDeepLinkArgs,
	IGetDeepLinkData,
	IGetDeepLinkListData,
	ISetDeepLinkArgs,
} from 'features/providerAppDownload/type'
import { assign } from 'lodash'
import { v4 as uuidV4 } from 'uuid'

export const providerAppDownload = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDeepLinkList: builder.query<
			IAxiosResponse<IGetDeepLinkListData[]>,
			null
		>({
			query: () => ({
				url: 'GetAllData/GetDeepLinkList',
				method: 'POST',
			}),
		}),
		getDeepLink: builder.query<
			IAxiosResponse<IGetDeepLinkData[]>,
			IGetDeepLinkArgs
		>({
			query: data => ({
				url: 'DeepLink/GetList',
				method: 'POST',
				data,
			}),
			// 這裡需要 transferResponse 主要是因為 editable row 需要 unique key 作為判斷
			// 但這份 response 本身並沒有 unique key , 故在前端自己加 , 僅供 UI 做比對使用
			transformResponse: (
				returnResponse: IAxiosResponse<IGetDeepLinkData[]>
			) => {
				const { data: deepLinks } = returnResponse
				const newData = deepLinks.map(link => assign(link, { key: uuidV4() }))
				const newReturnResponse = assign(returnResponse, { data: newData })
				return newReturnResponse
			},
			providesTags: ['POST'],
		}),
		setDeepLink: builder.mutation<IAxiosResponse<null>, ISetDeepLinkArgs>({
			query: data => ({
				url: 'DeepLink/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetDeepLinkListQuery,
	useLazyGetDeepLinkQuery,
	useSetDeepLinkMutation,
} = providerAppDownload
