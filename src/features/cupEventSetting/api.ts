import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import { assign, find, range } from 'lodash'
import {
	IGetCupEventPredictionResponse,
	ISetCupEventPredictionSettingArgs,
	ISortedCupEventTeamResponse,
} from './type'

export const cupEventSettingApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// * 撈取所有比賽隊伍及已設定清單
		getCupEventPredictionSetting: builder.query<
			ISortedCupEventTeamResponse,
			null
		>({
			query: data => ({
				url: 'CupEvent/GetCupEventPredictionSetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
			// * 格式化成適合以 antd table 呈現的資料結構
			transformResponse: (returnResponse: IGetCupEventPredictionResponse) => {
				const {
					selectOptions,
					top24Team,
					roundOf16,
					quarterFinals,
					semiFinals,
					final,
				} = returnResponse.data

				// * 總共24隊
				const sortArr = range(1, 25)

				const sortedCupEventTeamData = sortArr.map((sort, index) => ({
					index,
					sort,
					top24Team: assign(find(top24Team, { sort }), { sort }),
					roundOf16: assign(find(roundOf16, { sort }), { sort }),
					quarterFinals: assign(find(quarterFinals, { sort }), { sort }),
					semiFinals: assign(find(semiFinals, { sort }), { sort }),
					final: assign(find(final, { sort }), { sort }),
				}))

				const newReturnResponse: any = assign(returnResponse, {
					data: {
						selectOptions,
						sortedCupEventTeamData,
					},
				})

				return newReturnResponse as ISortedCupEventTeamResponse
			},
		}),
		// * 設定參賽隊伍名單
		setCupEventPredictionSetting: builder.mutation<
			IAxiosResponse<void>,
			ISetCupEventPredictionSettingArgs
		>({
			query: data => ({
				url: 'CupEvent/SetCupEventPredictionSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetCupEventPredictionSettingQuery,
	useSetCupEventPredictionSettingMutation,
} = cupEventSettingApi
