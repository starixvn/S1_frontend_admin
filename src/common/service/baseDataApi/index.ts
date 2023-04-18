import { IAxiosResponse } from '../axiosBaseQuery'
import { rootApi } from '../rootApi/api'
import {
	BankInfoOffResponse,
	IBankCodeResponse,
	IGetBankCodeListArgs,
	IVipLevelEnumResponse,
	IGetVipLevelSettingBySiteIdArgs,
	IGetCalCodeListArgs,
	ICalCodeResponse,
	IPaymentData,
	IGetGameListArgs,
	IGameList,
	IGetOnlinePayListArgs,
	IOnlinePayData,
	ICryptoPayData,
	IGetCryptoPayListArgs,
	IGetCryptoWalletArgs,
	ICryptoWalletData,
	IGameCasinoByIdData,
} from './type'

export const GET_BANK_INFO_OFF_LIST_ARGS = {
	PURPOSE: {
		DEPOSIT: 1,
		WITHDRAWAL: 2,
		DEPOSIT_WITHDRAWAL: 3,
	},
}

interface IGetPaymentListArgs {
	/**
	 * @argument number - payId
	 * @argument null - 全部
	 */
	payId: number | null
}

export const baseDataApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBankInfoOffList: builder.query<
			BankInfoOffResponse,
			{
				siteId?: number
				currencyId?: number
				purpose?: number
			}
		>({
			query: data => ({
				url: 'BaseData/GetBankInfoOffList',
				method: 'POST',
				data,
			}),
		}),
		getBankCodeList: builder.query<IBankCodeResponse, IGetBankCodeListArgs>({
			query: data => ({
				url: 'BaseData/GetBankCodeList',
				method: 'POST',
				data,
			}),
		}),
		getVipLevelEnumBySiteId: builder.query<
			IVipLevelEnumResponse,
			IGetVipLevelSettingBySiteIdArgs
		>({
			query: data => ({
				url: 'BaseData/GetVipLevelSettingBySiteId',
				method: 'POST',
				data,
			}),
		}),
		getCalCodeList: builder.query<ICalCodeResponse, IGetCalCodeListArgs>({
			query: data => ({
				url: 'BaseData/GetCalCodeList',
				method: 'POST',
				data,
			}),
		}),
		// * 取得 Payment 資訊
		getPaymentList: builder.query<
			IAxiosResponse<IPaymentData[]>,
			IGetPaymentListArgs
		>({
			query: data => ({
				url: 'BaseData/GetPaymentList',
				method: 'POST',
				data,
			}),
		}),
		// 用 tpId 和 categoryId 取得指定 category的所有遊戲
		getGameIdByTpIdAndCategoryId: builder.query<
			IAxiosResponse<IGameList[]>,
			IGetGameListArgs
		>({
			query: data => ({
				url: 'BaseData/GetGameIdByTpIdAndCategoryId',
				method: 'POST',
				data,
			}),
		}),
		// 取得用戶 onlinePayList 列表
		getOnlinePayList: builder.query<
			IAxiosResponse<IOnlinePayData[]>,
			IGetOnlinePayListArgs
		>({
			query: data => ({
				url: 'BaseData/GetOnlinePayList',
				method: 'POST',
				data,
			}),
		}),
		// 取得用戶 cryptoPayList 列表
		getCryptoPayList: builder.query<
			IAxiosResponse<ICryptoPayData[]>,
			IGetCryptoPayListArgs
		>({
			query: data => ({
				url: 'BaseData/GetCryptoPayList',
				method: 'POST',
				data,
			}),
		}),
		getCryptoWalletList: builder.query<
			IAxiosResponse<ICryptoWalletData[]>,
			IGetCryptoWalletArgs
		>({
			query: data => ({
				url: 'BaseData/GetCryptoWalletList',
				method: 'POST',
				data,
			}),
		}),
		getGameCasinoByTpId: builder.query<
			IAxiosResponse<IGameCasinoByIdData[]>,
			{ tpId: number }
		>({
			query: data => ({
				url: 'BaseData/GetGameCasinoByTpId',
				method: 'POST',
				data,
			}),
		}),
		getEwalletList: builder.query<
			IAxiosResponse<IOnlinePayData[]>,
			{ currencyId: number }
		>({
			query: data => ({
				url: 'BaseData/GetEWalletPayList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useGetBankInfoOffListQuery,
	useGetBankCodeListQuery,
	useGetOnlinePayListQuery,
	useGetVipLevelEnumBySiteIdQuery,
	useGetCalCodeListQuery,
	useLazyGetPaymentListQuery,
	useGetGameIdByTpIdAndCategoryIdQuery,
	useGetCryptoPayListQuery,
	useGetCryptoWalletListQuery,
	useLazyGetGameCasinoByTpIdQuery,
	useGetEwalletListQuery,
} = baseDataApi
