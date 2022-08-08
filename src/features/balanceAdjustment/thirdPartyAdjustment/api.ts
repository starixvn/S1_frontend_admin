import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetTpListBySiteIdArgs,
	ITpListBySiteResponse,
	IAdjustmentReasonResponse,
	ISetTpFundsAdjustmentArgs,
	ITpLogResponse,
	IGetTpLogArgs,
} from './type'

interface IGetCustInfoWithTpBalanceArgs {
	siteId?: number
	userName: string
	sabaId: string
}

interface ICustInfoWithTpBalanceData {
	tpWalletList: {
		tpId: number
		tpName: string
		tpUserName: string
		balance: number
		walletType: number
	}[]
	siteId: number
	siteName: string
	custId: number
	userName: string
	currencyId: number
	status: number
	balance: number
}

type ICustInfoWithTpBalanceResponse = IAxiosResponse<ICustInfoWithTpBalanceData>

export const thirdPartyAdjustmentApi = createApi({
	reducerPath: 'thirdPartyAdjustmentApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		// * 取得指定品牌第三方，用於下拉選單
		getTpListBySiteId: builder.query<
			ITpListBySiteResponse,
			IGetTpListBySiteIdArgs
		>({
			query: data => ({
				url: 'TpFundsAdjustment/GetTpBySiteId',
				method: 'POST',
				data,
			}),
		}),
		// * 取得調帳原因清單，用於下拉選單
		getAdjustmentReasonList: builder.query<IAdjustmentReasonResponse, null>({
			query: data => ({
				url: 'BalanceAdjustment/GetReasonList',
				method: 'POST',
				data,
			}),
		}),
		// * 取得客戶資料、主錢包餘額及三方錢包餘額
		getCustInfoWithTpBalance: builder.query<
			ICustInfoWithTpBalanceResponse,
			IGetCustInfoWithTpBalanceArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetCustInfoWithTpBalance',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 取得第三方調帳紀錄
		// TODO: 目前沒用到，準備移出去做
		getTpLog: builder.query<ITpLogResponse, IGetTpLogArgs>({
			query: data => ({
				url: 'TpFundsAdjustment/GetLog',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 送出調整餘額資訊
		setTpFundsAdjustment: builder.mutation<
			IAxiosResponse<void>,
			ISetTpFundsAdjustmentArgs
		>({
			query: data => ({
				url: 'TpFundsAdjustment/Submit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetTpListBySiteIdQuery,
	useGetAdjustmentReasonListQuery,
	useLazyGetCustInfoWithTpBalanceQuery,
	useLazyGetTpLogQuery,
	useSetTpFundsAdjustmentMutation,
} = thirdPartyAdjustmentApi
