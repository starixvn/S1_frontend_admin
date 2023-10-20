import { rootApi } from 'common/service/rootApi/api'
import {
	IGetBetListArgs,
	IGetBetListResponse,
	IGetCategoryResponse,
	IGetProductsResponse,
	IGetProvidersResponse,
	IGetTagsResponse,
	IGetVipLevelsResponse,
} from './type'

export const betListApi = rootApi.injectEndpoints({
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
		getProducts: builder.query<
			IGetProductsResponse,
			{
				siteId?: number[]
			}
		>({
			query: data => ({
				url: 'GetAllData/GetTpGameType',
				method: 'POST',
				data,
			}),
		}),
		getVipLevels: builder.query<IGetVipLevelsResponse, null>({
			query: () => ({
				url: 'GetAllData/GetAllSiteVipLevelList',
				method: 'POST',
			}),
		}),
		getTags: builder.query<IGetTagsResponse, null>({
			query: () => ({
				url: 'BaseData/GetTagByStatus',
				method: 'POST',
				data: { status: 0 },
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
	useGetTagsQuery,
	useGetVipLevelsQuery,
	useGetCategoryQuery,
	useGetProductsQuery,
	useGetProvidersQuery,
	useExportBetListFileMutation,
} = betListApi
