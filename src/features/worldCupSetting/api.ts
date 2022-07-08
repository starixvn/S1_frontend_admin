import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import { assign, find, range } from 'lodash'
import {
	IGetWorldCupPredictionResponse,
	ISetWorldCupPredictionSettingArgs,
	ISortedWorldCupTeamResponse,
} from './type'

export const worldCupSettingApi = createApi({
	reducerPath: 'worldCupSettingApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		// * 撈取所有比賽隊伍及已設定清單
		getWorldCupPredictionSetting: builder.query<
			ISortedWorldCupTeamResponse,
			null
		>({
			query: data => ({
				url: 'worldCupPrediction/getWorldCupPredictionSetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
			// * 格式化成適合以 antd table 呈現的資料結構
			transformResponse: (returnResponse: IGetWorldCupPredictionResponse) => {
				const {
					selectOptions,
					top32Team,
					roundOf16,
					quarterFinals,
					semiFinals,
					final,
				} = returnResponse.data

				// * 總共３２隊
				const sortArr = range(1, 33)

				const sortedWorldCupTeamData = sortArr.map((sort, index) => ({
					index,
					sort,
					top32Team: assign(find(top32Team, { sort }), { sort }),
					roundOf16: assign(find(roundOf16, { sort }), { sort }),
					quarterFinals: assign(find(quarterFinals, { sort }), { sort }),
					semiFinals: assign(find(semiFinals, { sort }), { sort }),
					'3rdPlace': assign(find(returnResponse.data['3rdPlace'], { sort }), {
						sort,
					}),
					final: assign(find(final, { sort }), { sort }),
				}))

				const newReturnResponse: any = assign(returnResponse, {
					data: {
						selectOptions,
						sortedWorldCupTeamData,
					},
				})

				return newReturnResponse as ISortedWorldCupTeamResponse
			},
		}),
		// * 設定參賽隊伍名單
		setWorldCupPredictionSetting: builder.mutation<
			IAxiosResponse<void>,
			ISetWorldCupPredictionSettingArgs
		>({
			query: data => ({
				url: 'worldCupPrediction/setWorldCupPredictionSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetWorldCupPredictionSettingQuery,
	useSetWorldCupPredictionSettingMutation,
} = worldCupSettingApi
