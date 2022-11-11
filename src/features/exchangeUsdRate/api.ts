import { rootApi } from 'common/service/rootApi/api'
import {
	IGetUsdRateListResponse,
	ISetUsdArgs,
} from 'features/exchangeUsdRate/type'

export const exchangeUsdRateApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getUsdRateList: builder.query<IGetUsdRateListResponse, null>({
			query: data => ({
				url: 'ExchangeRate/GetUSDRateList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setUsd: builder.mutation<null, ISetUsdArgs>({
			query: data => ({
				url: 'ExchangeRate/SetUSD',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useGetUsdRateListQuery, useSetUsdMutation } = exchangeUsdRateApi
