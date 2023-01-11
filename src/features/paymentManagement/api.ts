import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetBankInfoData,
	IGetBankInfoArgs,
	IGetGlobalStatusArgs,
	IGetGlobalStatusData,
	IGetPaySettingListArgs,
	IGetPaySettingData,
	ISetBankStatusArgs,
	ISetGlobalStatusArgs,
	ISetPaySettingArgs,
	ISetPaySettingStatusArgs,
	ISetPayListLoginInfoArgs,
	IGetCryptoInfoData,
	ISetCryptoInfoArgs,
	ISetPaySettingChargeFeeArgs,
} from 'features/paymentManagement/type'

export const paymentManagementApi = createApi({
	reducerPath: 'paymentManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: [
		'SetGlobalStatus',
		'SetPaySetting',
		'SetBankStatus',
		'SetCryptoStatus',
	],
	endpoints: builder => ({
		// 取得global status 列表
		getGlobalStatusList: builder.query<
			IAxiosResponse<IGetGlobalStatusData[]>,
			IGetGlobalStatusArgs
		>({
			query: data => ({
				url: 'ThirdPartyManagement/GetPayList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetGlobalStatus'],
		}),
		// 設定 global status
		setGlobalStatus: builder.mutation<void, ISetGlobalStatusArgs>({
			query: data => ({
				url: 'ThirdPartyManagement/SetPayListStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetGlobalStatus'],
		}),
		// 設定支付三方後台登入資訊
		setPayListLoginInfo: builder.mutation<void, ISetPayListLoginInfoArgs>({
			query: data => ({
				url: 'ThirdPartyManagement/SetPayListLoginInfo',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetGlobalStatus'],
		}),
		// 取得支付三方設定列表
		getPaySettingList: builder.query<
			IAxiosResponse<IGetPaySettingData[]>,
			IGetPaySettingListArgs
		>({
			query: data => ({
				url: 'ThirdPartyManagement/GetPaySettingList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetPaySetting'],
		}),
		// 設定支付三方
		setPaySetting: builder.mutation<void, ISetPaySettingArgs>({
			query: data => ({
				url: 'ThirdPartyManagement/SetPaySetting',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetPaySetting'],
		}),
		// 支付三方狀態設定
		setPaySettingStatus: builder.mutation<void, ISetPaySettingStatusArgs>({
			query: data => ({
				url: 'ThirdPartyManagement/SetPaySettingStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetPaySetting'],
		}),
		// 取得三方支援的銀行
		getBankInfoList: builder.query<
			IAxiosResponse<IGetBankInfoData[]>,
			IGetBankInfoArgs
		>({
			query: data => ({
				url: 'ThirdPartyManagement/GetBankInfoList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetBankStatus'],
		}),
		// 更新三方支援銀行狀態
		// status :  1 = Enable , 2 = Disable
		setBankStatus: builder.mutation<void, ISetBankStatusArgs>({
			query: data => ({
				url: 'ThirdPartyManagement/SetBankStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetBankStatus'],
		}),
		// 取得 CryptoInfo
		getCryptoInfo: builder.query<IAxiosResponse<IGetCryptoInfoData[]>, null>({
			query: data => ({
				url: 'ThirdPartyManagement/GetCryptoInfoList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetCryptoStatus'],
		}),
		// 更新 Crypto 狀態
		setCryptoInfo: builder.mutation<IAxiosResponse<null>, ISetCryptoInfoArgs>({
			query: data => ({
				url: 'ThirdPartyManagement/SetCryptoInfoStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetCryptoStatus'],
		}),
		// 設定 ChargeFee
		setChargeFee: builder.mutation<
			IAxiosResponse<null>,
			ISetPaySettingChargeFeeArgs
		>({
			query: data => ({
				url: 'ThirdPartyManagement/SetPaySettingChargeFee',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetPaySetting'],
		}),
	}),
})

export const {
	useLazyGetBankInfoListQuery,
	useLazyGetPaySettingListQuery,
	useGetGlobalStatusListQuery,
	useSetGlobalStatusMutation,
	useSetPaySettingMutation,
	useSetPaySettingStatusMutation,
	useSetBankStatusMutation,
	useSetPayListLoginInfoMutation,
	useGetCryptoInfoQuery,
	useSetCryptoInfoMutation,
	useSetChargeFeeMutation,
} = paymentManagementApi
