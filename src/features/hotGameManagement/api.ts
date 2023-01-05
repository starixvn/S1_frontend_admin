import { rootApi } from 'common/service/rootApi/api'
import {
	IDeleteHotGameArgs,
	ICommonTpData,
	IHotGameData,
	IGetHotGameDetailArgs,
	IHotGameDetailData,
	IGetHotGameListArgs,
	IHotGameTopCategoryData,
	IGetTpGameTypeArgs,
	ITpGameTypeData,
	ISetDataArgs,
	ISetSortArgs,
} from 'features/hotGameManagement/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const hotGameManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// TopCategory
		getTopCategoryList: builder.query<
			IAxiosResponse<IHotGameTopCategoryData[]>,
			null
		>({
			query: () => ({
				url: 'HotGame/GetHotGameTopCategory',
				method: 'POST',
			}),
		}),
		getCommonTpList: builder.query<IAxiosResponse<ICommonTpData[]>, null>({
			query: () => ({
				url: 'HotGame/GetCommonTpList',
				method: 'POST',
			}),
		}),
		getTpGameTypeList: builder.query<
			IAxiosResponse<ITpGameTypeData[]>,
			IGetTpGameTypeArgs
		>({
			query: data => ({
				url: 'HotGame/GetTpGameType',
				method: 'POST',
				data,
			}),
		}),

		// Hot Game 列表
		getHotGameList: builder.query<
			IAxiosResponse<IHotGameData[]>,
			IGetHotGameListArgs
		>({
			query: data => ({
				url: 'HotGame/GetDataList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// 編輯內頁 Detail
		getHotGameDetail: builder.query<
			IAxiosResponse<IHotGameDetailData>,
			IGetHotGameDetailArgs
		>({
			query: data => ({
				url: 'HotGame/GetDetail',
				method: 'POST',
				data,
			}),
		}),
		// 設定與新增，新增帶 0
		setHotGame: builder.mutation<IAxiosResponse<void>, ISetDataArgs>({
			query: data => ({
				url: 'HotGame/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteHotGame: builder.mutation<IAxiosResponse<void>, IDeleteHotGameArgs>({
			query: data => ({
				url: 'HotGame/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// 設定 sorting
		setHotGameSort: builder.mutation<IAxiosResponse<void>, ISetSortArgs>({
			query: data => ({
				url: 'HotGame/Sorting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetTopCategoryListQuery,
	useGetCommonTpListQuery,
	useGetTpGameTypeListQuery,
	useLazyGetHotGameListQuery,
	useGetHotGameDetailQuery,
	useSetHotGameMutation,
	useDeleteHotGameMutation,
	useSetHotGameSortMutation,
} = hotGameManagementApi
