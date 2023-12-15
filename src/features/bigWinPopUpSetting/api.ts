import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IBigWinSettingData,
	IGetBigWinSettingArgs,
	ISetBigWinSettingArgs,
} from 'features/bigWinPopUpSetting/type'

export const bigWinPopUpSettingApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBigWinSetting: builder.query<
			IAxiosResponse<IBigWinSettingData[]>,
			IGetBigWinSettingArgs
		>({
			query: data => ({
				url: 'BigWin/GetBigWinSetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setBigWinSetting: builder.mutation<
			IAxiosResponse<null>,
			ISetBigWinSettingArgs
		>({
			query: data => ({
				url: 'BigWin/SetBigWinSetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useGetBigWinSettingQuery, useSetBigWinSettingMutation } =
	bigWinPopUpSettingApi
