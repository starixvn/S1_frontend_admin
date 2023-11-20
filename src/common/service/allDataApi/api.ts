import { assign, filter, includes, unionBy } from 'lodash'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from '../rootApi/api'
import {
	IBankInfoSysData,
	IBankInfoSysResponse,
	IGetCategoryResponse,
	IGetPayEnumListResponse,
	IGetProductsResponse,
	IGetPromotionTypeResponse,
	IVipLevelsResponse,
	IGateWayData,
	IGateWayArgs,
	ILangCodesData,
	IGetPaySettingListResponse,
	IGetTpIdData,
	ITpListData,
	ISlotTpData,
	ILocalPaySettingData,
	ISlotGameData,
	IVipLevelsData,
} from './type'

export const allDataApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getVipLevel: builder.query<
			IVipLevelsResponse,
			{ siteIdForFilter?: number; siteIdsForFilter?: number[] }
		>({
			query: () => ({
				url: 'GetAllData/GetAllSiteVipLevelList',
				method: 'POST',
			}),
			transformResponse: (
				returnResponse: IVipLevelsResponse,
				meta,
				{
					siteIdForFilter,
					siteIdsForFilter = [],
				}: { siteIdForFilter?: number; siteIdsForFilter?: number[] }
			) => {
				const { data: vipLevels } = returnResponse
				let newData: IVipLevelsData[] = []
				// * 以單選品牌作為基準過濾
				if (siteIdForFilter) {
					newData = vipLevels?.filter(
						({ siteId }) => siteId === siteIdForFilter
					)
				}
				// * 以複選品牌作為基準過濾並去除重複
				else if (siteIdsForFilter.length > 0) {
					// * api 是以 eventNames string[] 送 payload, 因此當是多品牌時，以 levelName 為基準去重
					newData = unionBy(
						vipLevels?.filter(({ siteId }) =>
							siteIdsForFilter.includes(siteId)
						),
						'levelName'
					)
				}

				const newReturnResponse: IVipLevelsResponse = assign(returnResponse, {
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
		// * 取得第三方支付廠商清單
		getPayEnumList: builder.query<IGetPayEnumListResponse, null>({
			query: () => ({
				url: 'GetAllData/GetPayList',
				method: 'POST',
			}),
		}),
		// 這裡有帶 siteId
		getGateWay: builder.query<IAxiosResponse<IGateWayData[]>, IGateWayArgs>({
			query: data => ({
				url: 'GetAllData/GetPayList',
				method: 'POST',
				data,
			}),
		}),
		// 取得 site 底下所有 langCodes
		getLangCodes: builder.query<
			IAxiosResponse<ILangCodesData>,
			{ siteId?: number }
		>({
			query: data => ({
				url: 'GetAllData/GetServerInfo',
				method: 'POST',
				data,
			}),
		}),
		getTpList: builder.query<IAxiosResponse<ITpListData[]>, null>({
			query: data => ({
				url: 'GetAllData/GetTpList',
				method: 'POST',
				data,
			}),
		}),
		getTpIdList: builder.query<IAxiosResponse<IGetTpIdData[]>, null>({
			query: () => ({
				url: 'GetAllData/GetTpList',
				method: 'POST',
			}),
		}),
		getSlotTpList: builder.query<IAxiosResponse<ISlotTpData[]>, null>({
			query: () => ({
				url: 'GetAllData/GetSlotTpList',
				method: 'POST',
			}),
		}),
		getSlotGameList: builder.query<IAxiosResponse<ISlotGameData[]>, null>({
			query: () => ({
				url: 'GetAllData/GetSlotGame',
				method: 'POST',
			}),
		}),
		// 取得所有 paymentSetting
		getPaySettingList: builder.query<IGetPaySettingListResponse, null>({
			query: data => ({
				url: 'GetAllData/GetPaySetting',
				method: 'POST',
				data,
			}),
		}),
		// 取得所有 LocalPay 設定
		getLocalPaySettingList: builder.query<
			IAxiosResponse<ILocalPaySettingData[]>,
			null
		>({
			query: data => ({
				url: 'GetAllData/GetLocalPaySetting',
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
	useGetPromotionListQuery,
	useGetPayEnumListQuery,
	useGetGateWayQuery,
	useGetLangCodesQuery,
	useGetPaySettingListQuery,
	useGetTpIdListQuery,
	useGetSlotTpListQuery,
	useGetTpListQuery,
	useGetLocalPaySettingListQuery,
	useGetProductsQuery,
	useGetSlotGameListQuery,
} = allDataApi
