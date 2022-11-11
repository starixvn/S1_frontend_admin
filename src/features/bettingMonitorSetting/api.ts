import { rootApi } from 'common/service/rootApi/api'
import {
	IDelSettingArgs,
	IGetListArgs,
	IGetListResponse,
	IGetTpGameTypeResponse,
	IGetTpListResponse,
	ISetSettingArgs,
} from 'features/bettingMonitorSetting/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const bettingMonitorSettingApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getTpList: builder.query<IGetTpListResponse, null>({
			query: data => ({
				url: 'GetAllData/GetTpList',
				method: 'POST',
				data,
			}),
		}),
		getTpGameTypes: builder.query<IGetTpGameTypeResponse, null>({
			query: data => ({
				url: 'GetAllData/GetTpGameType',
				method: 'POST',
				data,
			}),
		}),
		getBettingMonitorList: builder.query<IGetListResponse, IGetListArgs>({
			query: data => ({
				url: 'BettingMonitor/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setBettingMonitorSetting: builder.mutation<
			IAxiosResponse<null>,
			ISetSettingArgs
		>({
			query: data => ({
				url: 'BettingMonitor/SetSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteBettingMonitorSetting: builder.mutation<
			IAxiosResponse<null>,
			IDelSettingArgs
		>({
			query: data => ({
				url: 'BettingMonitor/DelSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})
export const {
	useGetTpListQuery,
	useGetTpGameTypesQuery,
	useLazyGetBettingMonitorListQuery,
	useSetBettingMonitorSettingMutation,
	useDeleteBettingMonitorSettingMutation,
} = bettingMonitorSettingApi
