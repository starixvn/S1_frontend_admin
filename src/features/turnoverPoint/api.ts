import { rootApi } from 'common/service/rootApi/api'
import {
	IGetTpCategoryArg,
	IGetTpCategoryResponse,
	IGetTpGameTypeArg,
	IGetTpGameTypeResponse,
	IGetTurnoverPointSettingArgs,
	IGetTurnoverPointSettingListArgs,
	IGetTurnoverPointSettingListResponse,
	IGetTurnoverPointSettingResponse,
	IGetTurnoverPointStatusSettingArgs,
	IGetTurnoverPointStatusSettingResponse,
	ISetTurnoverPointSettingArgs,
	ISetTurnoverPointStatusSettingArgs,
} from './type'

export const turnoverPointApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getCategory: builder.query<IGetTpCategoryResponse, IGetTpCategoryArg>({
			query: data => ({
				url: 'BaseData/GetTpCategoryList',
				method: 'POST',
				data,
			}),
		}),
		getTurnoverPointSettingList: builder.query<
			IGetTurnoverPointSettingListResponse,
			IGetTurnoverPointSettingListArgs
		>({
			query: data => ({
				url: 'PointSetting/GetTurnoverPointSettingList',
				method: 'POST',
				data,
			}),
		}),
		getTurnoverPointSetting: builder.query<
			IGetTurnoverPointSettingResponse,
			IGetTurnoverPointSettingArgs
		>({
			query: data => ({
				url: 'PointSetting/GetTurnoverPointSetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setTurnoverPointSetting: builder.mutation<
			void,
			ISetTurnoverPointSettingArgs
		>({
			query: data => ({
				url: 'PointSetting/SetTurnoverPointSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getTurnoverPointStatusSetting: builder.query<
			IGetTurnoverPointStatusSettingResponse,
			IGetTurnoverPointStatusSettingArgs
		>({
			query: data => ({
				url: 'PointSetting/GetTurnoverPointStatusSetting',
				method: 'POST',
				data,
			}),
		}),
		setTurnoverPointStatusSetting: builder.mutation<
			void,
			ISetTurnoverPointStatusSettingArgs
		>({
			query: data => ({
				url: 'PointSetting/SetTurnoverPointStatusSetting',
				method: 'POST',
				data,
			}),
		}),
		getTpGameType: builder.query<IGetTpGameTypeResponse, IGetTpGameTypeArg>({
			query: data => ({
				url: 'BaseData/GetTpGameTypeList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useGetCategoryQuery,
	useLazyGetTurnoverPointSettingListQuery,
	useSetTurnoverPointSettingMutation,
	useLazyGetTurnoverPointStatusSettingQuery,
	useSetTurnoverPointStatusSettingMutation,
	useGetTurnoverPointSettingQuery,
	useLazyGetTpGameTypeQuery,
} = turnoverPointApi
