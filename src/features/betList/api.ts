import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import { IGetBetListArgs, IGetBetListResponse } from './type'

export const betListApi = createApi({
	reducerPath: 'betListApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getBetList: builder.query<IGetBetListResponse, IGetBetListArgs>({
			query: data => ({
				url: 'BetListReport/GetBetList',
				method: 'POST',
				data,
			}),
		}),
		exportBetListFile: builder.mutation<Blob, IGetBetListArgs>({
			query: data => ({
				url: 'BetListReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})
export const { useLazyGetBetListQuery, useExportBetListFileMutation } =
	betListApi
