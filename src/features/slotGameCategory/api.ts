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
	IGetSlotGameByIdArgs,
	TSlotGameDetail,
	IEditSlotGameArgs,
	IGetSlotGameListExportArgs,
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
		getSlotGameById: builder.query<
			IAxiosResponse<IGetSlotGameByIdArgs & TSlotGameDetail>,
			IGetSlotGameByIdArgs
		>({
			query: data => ({
				url: 'SlotGamesManagement/GetById',
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
		// 新增 slot game 用
		setNewSlotGame: builder.mutation<void, ISetNewSlotGameArgs>({
			query: data => ({
				url: 'SlotGamesManagement/SetNewSlotGame',
				method: 'POST',
				data,
			}),
		}),
		// 編輯已經新增過的 slot game
		editSlotGame: builder.mutation<void, IEditSlotGameArgs>({
			query: data => ({
				url: 'SlotGamesManagement/Set',
				method: 'POST',
				data,
			}),
		}),
		// 不管新增編輯都是用這隻傳圖
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
		exportSlotGameList: builder.mutation<Blob, IGetSlotGameListExportArgs>({
			query: data => ({
				url: 'SlotGamesManagement/ExportSlotGameList',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetSlotGamesTpListQuery,
	useLazyGetSlotGameByIdQuery,
	useLazyGetSlotGameListQuery,
	useLazyGetSlotGameCategoryListQuery,
	useSetSlotGameMutation,
	useSetSlotGameCategoryMutation,
	useGetSlotCategoryListQuery,
	useSetSlotGameAllCurrencyMutation,
	useSetSlotGameEnvironmentMutation,
	useSetNewSlotGameMutation,
	useEditSlotGameMutation,
	useUpdateSlotGameImageMutation,
	useExportSlotGameListMutation,
} = slotGameCategoryApi
