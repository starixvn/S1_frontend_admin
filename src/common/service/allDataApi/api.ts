import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { assign, filter, includes } from 'lodash'
import { baseUrl } from '../Api'
import { axiosBaseQuery } from '../axiosBaseQuery'
import {
	IBankInfoSysData,
	IBankInfoSysResponse,
	IGetCategoryResponse,
	IVipLevelsResponse,
} from './type'

export const allDataApi = createApi({
	reducerPath: 'allDataApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: builder => ({
		getVipLevel: builder.query<
			IVipLevelsResponse,
			{ siteIdForFilter?: number }
		>({
			query: () => ({
				url: 'GetAllData/GetAllSiteVipLevelList',
				method: 'POST',
			}),
			transformResponse: (
				returnResponse: IVipLevelsResponse,
				meta,
				{ siteIdForFilter }: { siteIdForFilter?: number }
			) => {
				const { data: vipLevels } = returnResponse
				const newData = vipLevels?.filter(
					({ siteId }) => siteId === siteIdForFilter
				)
				const newReturnResponse: any = assign(returnResponse, {
					data: [...newData],
				})
				return newReturnResponse
			},
		}),
		getCategory: builder.query<IGetCategoryResponse, null>({
			query: () => ({
				url: 'GetAllData/GetTpCategory',
				method: 'POST',
			}),
		}),
		getBankInfoSys: builder.query<IBankInfoSysResponse, null>({
			query: () => ({
				url: 'GetAllData/GetBankInfoSys',
				method: 'POST',
			}),
		}),
	}),
})

export const selectBankInfoSysByCurrencyIds =
	(currencyIds: number[]) =>
	({ data: { data: originBankInfoSys = [] } = {}, isFetching }: any) => {
		const newBankInfoSys = filter(originBankInfoSys, item =>
			includes(currencyIds, item.currencyId)
		) as IBankInfoSysData[]
		return { bankInfoSys: newBankInfoSys, isFetching }
	}

export const {
	useGetVipLevelQuery,
	useGetBankInfoSysQuery,
	useGetCategoryQuery,
} = allDataApi
