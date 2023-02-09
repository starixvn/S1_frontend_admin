import { rootApi } from 'common/service/rootApi/api'
import {
	IGetPendingBonusListArgs,
	IGetPendingBonusListResponse,
	ITransferMultiArgs,
	ITransferMultiResponse,
} from 'features/pendingBonus/type'

export const pendingBonusApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPendingBonusList: builder.query<
			IGetPendingBonusListResponse,
			IGetPendingBonusListArgs
		>({
			query: data => ({
				url: 'PendingBonus/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		transferMulti: builder.mutation<ITransferMultiResponse, ITransferMultiArgs>(
			{
				query: data => ({
					url: 'PendingBonus/TransferMulti',
					method: 'POST',
					data,
				}),
				invalidatesTags: ['POST'],
			}
		),
	}),
})

export const { useGetPendingBonusListQuery, useTransferMultiMutation } =
	pendingBonusApi
