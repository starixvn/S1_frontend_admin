import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IDrawPrizesEventNameResponse,
	IExportBonusListArgs,
	IGetBonusEventNamesResponse,
	IGetBonusListArgs,
	IGetBonusListResponse,
} from 'features/bonusExport/type'

export const bonusExportApi = createApi({
	reducerPath: 'bonusExportApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: builder => ({
		getDrawPrizesEventNames: builder.query<IDrawPrizesEventNameResponse, null>({
			query: () => ({
				url: 'GetAllData/GetEventName',
				method: 'POST',
			}),
		}),
		getBonusEventNames: builder.query<IGetBonusEventNamesResponse, null>({
			query: () => ({
				url: 'GetAllData/GetPromotionType',
				method: 'POST',
				data: { isPayout: false },
			}),
		}),
		getBonusList: builder.query<IGetBonusListResponse, IGetBonusListArgs>({
			query: data => ({
				url: 'RewardBonusReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportBonusList: builder.mutation<Blob, IExportBonusListArgs>({
			query: data => ({
				url: 'RewardBonusReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetDrawPrizesEventNamesQuery,
	useGetBonusEventNamesQuery,
	useLazyGetBonusListQuery,
	useExportBonusListMutation,
} = bonusExportApi
