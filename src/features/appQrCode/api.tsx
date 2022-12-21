import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetProtocolTypeEnumArgs,
	IGetAppLinkArgs,
	ISetAppLinkArgs,
	IProtocolTypeEnumResponse,
	IGetAppLinkResponse,
} from 'features/appQrCode/type'
import { assign } from 'lodash'
import { v4 as uuidV4 } from 'uuid'

export const appQrCodeApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getProtocolTypeEnum: builder.query<
			IProtocolTypeEnumResponse,
			IGetProtocolTypeEnumArgs
		>({
			query: data => ({
				url: 'Enum/GetEnumType',
				method: 'POST',
				data,
			}),
		}),
		getAppLinkList: builder.query<IGetAppLinkResponse, IGetAppLinkArgs>({
			query: data => ({
				url: 'AppLink/GetList',
				method: 'POST',
				data,
			}),
			transformResponse: (returnResponse: IGetAppLinkResponse) => {
				const { data: appLinkData } = returnResponse
				const newData = appLinkData.map(link => assign(link, { key: uuidV4() }))
				const newReturnResponse = assign(returnResponse, { data: newData })
				return newReturnResponse
			},
			providesTags: ['POST'],
		}),
		setAppLink: builder.mutation<IAxiosResponse<null>, ISetAppLinkArgs>({
			query: data => ({
				url: 'AppLink/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetProtocolTypeEnumQuery,
	useGetAppLinkListQuery,
	useSetAppLinkMutation,
} = appQrCodeApi
