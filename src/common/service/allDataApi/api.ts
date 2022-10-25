import { assign, filter, includes } from 'lodash'
import { rootApi } from '../rootApi/api'
import {
	IBankInfoSysData,
	IBankInfoSysResponse,
	IGetCategoryResponse,
	IGetProductsResponse,
	IGetPromotionTypeResponse,
	IVipLevelsResponse,
} from './type'

export const allDataApi = rootApi.injectEndpoints({
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
		getProducts: builder.query<IGetProductsResponse, null>({
			query: () => ({
				url: 'GetAllData/GetTpGameType',
				method: 'POST',
			}),
		}),
		getPromotionList: builder.query<
			IGetPromotionTypeResponse,
			// * Bonus Report: {isPayout: false, isNew: true}
			{
				isPayout: boolean
				isNew: boolean
			}
		>({
			query: data => ({
				url: 'GetAllData/GetPromotionType',
				method: 'POST',
				data,
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
	useGetProductsQuery,
	useGetPromotionListQuery,
} = allDataApi
