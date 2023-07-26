import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetRebateExcludeGameListArgs,
	IRebateExcludeGameData,
	ISetRebateExcludeGameArgs,
} from 'features/rebateExcludeGame/type'

const rebateExcludeGameApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getRebateExcludeGameList: builder.query<
			IAxiosResponse<IRebateExcludeGameData[]>,
			IGetRebateExcludeGameListArgs
		>({
			query: data => ({
				url: 'RebateExcludeGame/GetByCurrencyId',
				method: 'POST',
				data,
			}),
		}),
		setRebateExcludeGame: builder.mutation<
			IAxiosResponse<void>,
			ISetRebateExcludeGameArgs
		>({
			query: data => ({
				url: 'RebateExcludeGame/Set',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetRebateExcludeGameListQuery,
	useSetRebateExcludeGameMutation,
} = rebateExcludeGameApi
