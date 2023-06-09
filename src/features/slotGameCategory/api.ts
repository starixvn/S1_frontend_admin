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
	ISlotGameAllCurrencyArgs,
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
			providesTags: ['POST'],
		}),
		setSlotGameCategory: builder.mutation<void, ISetGameCategoryArgs>({
			query: data => ({
				url: 'SlotGamesManagement/SetSlotGameCategory',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getSlotCategoryList: builder.query<IGetSlotCategoryListResponse, null>({
			query: data => ({
				url: 'SlotGamesManagement/GetSlotCategoryList',
				method: 'POST',
				data,
			}),
		}),
		setSlotGameAllCurrency: builder.mutation<null, ISlotGameAllCurrencyArgs>({
			query: data => ({
				url: 'SlotGamesManagement/SetSlotGameAllCurrency',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
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
	useSetSlotGameAllCurrencyMutation,
} = slotGameCategoryApi
