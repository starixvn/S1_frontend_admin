import { rootApi } from 'common/service/rootApi/api'
import {
	IGetSlotGameCategoryListArgs,
	IGetSlotGameCategoryListResponse,
	IGetSlotGamesListArgs,
	IGetSlotGamesListResponse,
	IGetTpListResponse,
	ISetGameCategoryArgs,
	ISetSlotGameArgs,
	IGetSlotCategoryListResponse,
} from 'features/slotGameCategory/type'

export const slotGameCategoryApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getTpList: builder.query<IGetTpListResponse, null>({
			query: () => ({
				url: 'slotGamesManagement/GetTpList',
				method: 'POST',
			}),
		}),
		getSlotGameList: builder.query<
			IGetSlotGamesListResponse,
			IGetSlotGamesListArgs
		>({
			query: data => ({
				url: 'SlotGamesManagement/GetSlotGameList',
				method: 'POST',
				data,
			}),
		}),
		setSlotGame: builder.mutation<void, ISetSlotGameArgs>({
			query: data => ({
				url: 'SlotGamesManagement/SetSlotGame',
				method: 'POST',
				data,
			}),
		}),
		getSlotGameCategoryList: builder.query<
			IGetSlotGameCategoryListResponse,
			IGetSlotGameCategoryListArgs
		>({
			query: data => ({
				url: 'SlotGamesManagement/GetSlotGameCategoryList',
				method: 'POST',
				data,
			}),
		}),
		setSlotGameCategory: builder.mutation<void, ISetGameCategoryArgs>({
			query: data => ({
				url: 'SlotGamesManagement/SetSlotGameCategory',
				method: 'POST',
				data,
			}),
		}),
		getSlotCategoryList: builder.query<IGetSlotCategoryListResponse, null>({
			query: data => ({
				url: 'SlotGamesManagement/GetSlotCategoryList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useGetTpListQuery,
	useLazyGetSlotGameListQuery,
	useLazyGetSlotGameCategoryListQuery,
	useSetSlotGameMutation,
	useSetSlotGameCategoryMutation,
	useGetSlotCategoryListQuery,
} = slotGameCategoryApi
