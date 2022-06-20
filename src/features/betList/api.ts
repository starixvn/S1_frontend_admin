import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetBetListArgs,
	IGetBetListResponse,
	IGetCategoryResponse,
	IGetProductsResponse,
	IGetProvidersResponse,
} from './type'

export const betListApi = createApi({
	reducerPath: 'betListApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getBetList: builder.query<IGetBetListResponse, IGetBetListArgs>({
			query: data => ({
				url: 'BetListReport/GetBetList',
				method: 'POST',
				data,
			}),
		}),
		getCategory: builder.query<IGetCategoryResponse, null>({
			query: () => ({
				url: 'GetAllData/GetTpCategory',
				method: 'POST',
			}),
		}),
		getProviders: builder.query<IGetProvidersResponse, null>({
			query: () => ({
				url: 'GetAllData/GetTpList',
				method: 'POST',
			}),
		}),
		getProducts: builder.query<IGetProductsResponse, null>({
			query: () => ({
				url: 'GetAllData/GetTpGameType',
				method: 'POST',
			}),
		}),
		exportBetListFile: builder.mutation<Blob, IGetBetListArgs>({
			query: data => ({
				url: 'BetListReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})
export const {
	useLazyGetBetListQuery,
	useGetCategoryQuery,
	useGetProductsQuery,
	useGetProvidersQuery,
	useExportBetListFileMutation,
} = betListApi
