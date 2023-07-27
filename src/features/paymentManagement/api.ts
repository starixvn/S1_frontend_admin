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
	IAutoWithdrawalRuleData,
	IGetAutoWithdrawalRuleArgs,
	IAddAutoWithdrawalRuleArgs,
	ISetAutoWithdrawalRuleArgs,
	IDeleteAutoWithdrawalRuleArgs,
	IWithdrawalTypeData,
	IAutoVerifyRuleData,
	IGetAutoVerifyRuleArgs,
	IAddAutoVerifyRuleArgs,
	ISetAutoVerifyRuleArgs,
	IDeleteAutoVerifyRuleArgs,
} from 'features/paymentManagement/type'

export const paymentManagementApi = createApi({
	reducerPath: 'paymentManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: [
		'SetGlobalStatus',
		'SetPaySetting',
		'SetBankStatus',
		'SetCryptoStatus',
		'SetAutoWithdrawalRule',
		'SetAutoVerifyRule',
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
		// Auto Withdrawal Rule - 取得自動提款規則列表
		getAutoWithdrawalRuleList: builder.query<
			IAxiosResponse<IAutoWithdrawalRuleData[]>,
			IGetAutoWithdrawalRuleArgs
		>({
			query: data => ({
				url: 'AutoWithdrawalRule/GetDataList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetAutoWithdrawalRule'],
		}),
		//  Auto Withdrawal Rule - 新增自動提款規則
		AddAutoWithdrawalRule: builder.mutation<
			IAxiosResponse<null>,
			IAddAutoWithdrawalRuleArgs
		>({
			query: data => ({
				url: 'AutoWithdrawalRule/Create',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetAutoWithdrawalRule'],
		}),
		//  Auto Withdrawal Rule - 更新自動提款規則
		setAutoWithdrawalRule: builder.mutation<
			IAxiosResponse<null>,
			ISetAutoWithdrawalRuleArgs
		>({
			query: data => ({
				url: 'AutoWithdrawalRule/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetAutoWithdrawalRule'],
		}),
		//  Auto Withdrawal Rule - 刪除自動提款規則
		deleteAutoWithdrawalRule: builder.mutation<
			IAxiosResponse<null>,
			IDeleteAutoWithdrawalRuleArgs
		>({
			query: data => ({
				url: 'AutoWithdrawalRule/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetAutoWithdrawalRule'],
		}),
		// 取得自動提款的提款類型列表
		getWithdrawalTypeList: builder.query<
			IAxiosResponse<IWithdrawalTypeData[]>,
			null
		>({
			query: data => ({
				url: 'AutoWithdrawalRule/WithdrawalType',
				method: 'POST',
				data,
			}),
		}),
		// Auto Verify Rule - 取得自動驗證規則列表
		getAutoVerifyRuleList: builder.query<
			IAxiosResponse<IAutoVerifyRuleData[]>,
			IGetAutoVerifyRuleArgs
		>({
			query: data => ({
				url: 'AutoPaymentRule/GetDataList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetAutoVerifyRule'],
		}),
		//  Auto Verify Rule - 新增自動驗證規則
		AddAutoVerifyRule: builder.mutation<
			IAxiosResponse<null>,
			IAddAutoVerifyRuleArgs
		>({
			query: data => ({
				url: 'AutoPaymentRule/Create',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetAutoVerifyRule'],
		}),
		//  Auto Verify Rule - 更新自動驗證規則
		setAutoVerifyRule: builder.mutation<
			IAxiosResponse<null>,
			ISetAutoVerifyRuleArgs
		>({
			query: data => ({
				url: 'AutoPaymentRule/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetAutoVerifyRule'],
		}),
		//  Auto Verify Rule - 刪除自動驗證規則
		deleteAutoVerifyRule: builder.mutation<
			IAxiosResponse<null>,
			IDeleteAutoVerifyRuleArgs
		>({
			query: data => ({
				url: 'AutoPaymentRule/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetAutoVerifyRule'],
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
	useGetAutoWithdrawalRuleListQuery,
	useAddAutoWithdrawalRuleMutation,
	useSetAutoWithdrawalRuleMutation,
	useDeleteAutoWithdrawalRuleMutation,
	useGetWithdrawalTypeListQuery,
	useGetAutoVerifyRuleListQuery,
	useAddAutoVerifyRuleMutation,
	useSetAutoVerifyRuleMutation,
	useDeleteAutoVerifyRuleMutation,
} = paymentManagementApi
