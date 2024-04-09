import { createApi } from '@reduxjs/toolkit/dist/query/react'
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
	ISetSlogGameEnvironmentArgs,
	ISetNewSlotGameArgs,
} from 'features/slotGameCategory/type'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import { baseUrl } from '../../common/service/Api'

export const slotGameCategoryApi = createApi({
	reducerPath: 'slotGameManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: builder => ({
		getSlotGamesTpList: builder.query<
			IGetTpListResponse,
			{
				siteId?: number
				siteIds?: number[]
				currencyId: number
			}
		>({
			query: data => ({
				url: 'slotGamesManagement/GetTpList',
				method: 'POST',
				data,
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
		setSlotGameAllCurrency: builder.mutation<null, ISlotGameAllCurrencyArgs>({
			query: data => ({
				url: 'SlotGamesManagement/SetSlotGameAllCurrency',
				method: 'POST',
				data,
			}),
		}),
		setSlotGameEnvironment: builder.mutation<void, ISetSlogGameEnvironmentArgs>(
			{
				query: data => ({
					url: 'SlotGamesManagement/SetSlotGameEnvironment',
					method: 'POST',
					data,
				}),
			}
		),
		setNewSlotGame: builder.mutation<void, ISetNewSlotGameArgs>({
			query: data => ({
				url: 'SlotGamesManagement/SetNewSlotGame',
				method: 'POST',
				data,
			}),
		}),
		updateSlotGameImage: builder.mutation<
			IAxiosResponse<{ returnImagePath: string }>,
			FormData
		>({
			query: data => ({
				url: 'UploadImage/SlotGameManagement',
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
	useGetSlotGamesTpListQuery,
	useLazyGetSlotGameListQuery,
	useLazyGetSlotGameCategoryListQuery,
	useSetSlotGameMutation,
	useSetSlotGameCategoryMutation,
	useGetSlotCategoryListQuery,
	useSetSlotGameAllCurrencyMutation,
	useSetSlotGameEnvironmentMutation,
	useSetNewSlotGameMutation,
	useUpdateSlotGameImageMutation,
} = slotGameCategoryApi
