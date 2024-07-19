import { v4 as uuidV4 } from 'uuid'
import { rootApi } from 'common/service/rootApi/api'
import { assign } from 'lodash'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import type {
	ISetLotteryEventSettingArgs,
	ILotteryEventSettingData,
	IGetLotteryEventSettingArgs,
	IGetRaffleTicketStickerSettingArgs,
	ISetRaffleTicketStickerSettingArgs,
	IRaffleTicketStickerSettingResponse,
	ILotteryTicketHistoryData,
	IGetLotteryTicketHistoryArgs,
	ISetCreateLotteryMaintainArgs,
	IAddLotteryEventSettingArgs,
} from 'features/eventManagement/type'

const eventManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getLotteryEventSetting: builder.query<
			IAxiosResponse<ILotteryEventSettingData[]>,
			IGetLotteryEventSettingArgs
		>({
			query: data => ({
				url: 'LotteryEvent/GetLotteryEventSetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setLotteryEventSetting: builder.mutation<
			IAxiosResponse<void>,
			ISetLotteryEventSettingArgs
		>({
			query: data => ({
				url: 'LotteryEvent/SetLotteryEventSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		addLotteryEvent: builder.mutation<
			IAxiosResponse<void>,
			IAddLotteryEventSettingArgs
		>({
			query: data => ({
				url: 'LotteryEvent/AddLotteryEvent',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setLotteryMaintain: builder.mutation<
			IAxiosResponse<void>,
			ISetCreateLotteryMaintainArgs
		>({
			query: data => ({
				url: 'LotteryEvent/CreateLotteryMaintain',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getLotteryTicketHistory: builder.query<
			IAxiosResponse<ILotteryTicketHistoryData>,
			IGetLotteryTicketHistoryArgs
		>({
			query: data => ({
				url: 'LotteryEvent/GetLotteryTicketHistory',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getRaffleTicketStickerSetting: builder.query<
			IRaffleTicketStickerSettingResponse,
			IGetRaffleTicketStickerSettingArgs
		>({
			query: data => ({
				url: 'LotteryEvent/GetRaffleTicketStickerSetting',
				method: 'POST',
				data,
			}),
			transformResponse: (
				returnResponse: IRaffleTicketStickerSettingResponse
			) => {
				const { data: raffleTicketStickerSettingList } = returnResponse
				const newData = raffleTicketStickerSettingList.map(item =>
					assign(item, { key: uuidV4() })
				)
				return assign(returnResponse, { data: newData })
			},
			providesTags: ['POST'],
		}),
		setRaffleTicketStickerSetting: builder.mutation<
			IAxiosResponse<void>,
			ISetRaffleTicketStickerSettingArgs
		>({
			query: data => ({
				url: 'LotteryEvent/SetRaffleTicketStickerSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useSetLotteryMaintainMutation,
	useLazyGetLotteryEventSettingQuery,
	useSetLotteryEventSettingMutation,
	useAddLotteryEventMutation,
	useGetRaffleTicketStickerSettingQuery,
	useGetLotteryTicketHistoryQuery,
	useSetRaffleTicketStickerSettingMutation,
} = eventManagementApi
