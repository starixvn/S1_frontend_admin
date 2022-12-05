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
	}),
})

export const {
	useGetBankInfoOffListQuery,
	useGetBankCodeListQuery,
	useGetVipLevelEnumBySiteIdQuery,
	useGetCalCodeListQuery,
	useLazyGetPaymentListQuery,
} = baseDataApi
