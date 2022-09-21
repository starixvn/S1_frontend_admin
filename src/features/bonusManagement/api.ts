import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IDuplicateArgs,
	IExportScratchCardListArgs,
	IGenScratchCardCodeArgs,
	IGetBonusListArgs,
	IGetBonusListResponse,
	IGetByBonusCodeArgs,
	IGetByBonusCodeResponse,
	IGetCashBackGameListArgs,
	IGetCashBackGameListResponse,
	IGetPromotionCategoryArgs,
	IGetPromotionCategoryResponse,
	IGetPromotionTypeResponse,
	IGetScratchCardListArgs,
	IGetScratchCardListResponse,
	ISetArgs,
	IUpdateStatusArgs,
} from 'features/bonusManagement/type'

export const bonusManagementApi = createApi({
	reducerPath: 'bonusManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST', 'Scratch'],
	refetchOnMountOrArgChange: true,
	endpoints: builder => ({
		getBonusList: builder.query<IGetBonusListResponse, IGetBonusListArgs>({
			query: data => ({
				url: 'Bonus/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getByBonusCode: builder.query<IGetByBonusCodeResponse, IGetByBonusCodeArgs>(
			{
				query: data => ({
					url: 'Bonus/GetByBonusCode',
					method: 'POST',
					data,
				}),
			}
		),
		updateStatus: builder.mutation<IAxiosResponse<null>, IUpdateStatusArgs>({
			query: data => ({
				url: 'Bonus/UpdateStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setBonus: builder.mutation<IAxiosResponse<null>, ISetArgs>({
			query: data => ({
				url: 'Bonus/Set',
				method: 'POST',
				data,
			}),
		}),
		duplicateBonus: builder.mutation<IAxiosResponse<null>, IDuplicateArgs>({
			query: data => ({
				url: 'Bonus/Duplicate',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getPromotionList: builder.query<IGetPromotionTypeResponse, null>({
			query: () => ({
				url: 'GetAllData/GetPromotionType',
				method: 'POST',
				data: { isPayout: false, isNew: true },
			}),
		}),
		// bonusManagement 才用得到的 category
		getPromotionCategory: builder.query<
			IGetPromotionCategoryResponse,
			IGetPromotionCategoryArgs
		>({
			query: data => ({
				url: 'BaseData/GetPromotionCategoryList',
				method: 'POST',
				data,
			}),
		}),
		// 透過 promotionCategory 獲取 cashBackGameList
		getCashBackGameList: builder.query<
			IGetCashBackGameListResponse,
			IGetCashBackGameListArgs
		>({
			query: data => ({
				url: 'BaseData/GetCashBackGameList',
				method: 'POST',
				data,
			}),
		}),
		getScratchCardList: builder.query<
			IGetScratchCardListResponse,
			IGetScratchCardListArgs
		>({
			query: data => ({
				url: 'Bonus/GetScratchCardList',
				method: 'POST',
				data,
			}),
			providesTags: ['Scratch'],
		}),
		exportScratchCardList: builder.mutation<Blob, IExportScratchCardListArgs>({
			query: data => ({
				url: 'Bonus/ExportScratchCardList',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		// 生成新的 scratchCard
		createScratchCard: builder.mutation<
			IAxiosResponse<null>,
			IGenScratchCardCodeArgs
		>({
			query: data => ({
				url: 'Bonus/GenScratchCardCode',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['Scratch'],
		}),
	}),
})

export const {
	useLazyGetBonusListQuery,
	useGetPromotionListQuery,
	useLazyGetByBonusCodeQuery,
	useSetBonusMutation,
	useUpdateStatusMutation,
	useDuplicateBonusMutation,
	useLazyGetScratchCardListQuery,
	useExportScratchCardListMutation,
	useCreateScratchCardMutation,
	useGetPromotionCategoryQuery,
	useLazyGetCashBackGameListQuery,
} = bonusManagementApi
