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
	IWithdrawalTypeData,
	IAutoVerifyRuleData,
	IGetAutoVerifyRuleArgs,
	IAddAutoVerifyRuleArgs,
	ISetAutoVerifyRuleArgs,
	IDeleteAutoVerifyRuleArgs,
	IWithdrawalBlockSwitchData,
	ISetWithdrawalBlockSwitchArgs,
	ISystemBankInfoData,
	ISetSystemBankInfoArgs,
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
		'SetWithdrawalBlockSwitch',
		'SetSystemBankInfo',
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
		// 取得自動提款的提款類型列表
		getWithdrawalTypeList: builder.query<
			IAxiosResponse<IWithdrawalTypeData[]>,
			null
		>({
			query: data => ({
				url: 'AutoPaymentRule/WithdrawalType',
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
		// Withdrawal Option Status Management - 取得提款列表(針對前台 Bank Card/E-Wallet/Crypto)
		getWithdrawalBlockSwitchList: builder.query<
			IAxiosResponse<IWithdrawalBlockSwitchData[]>,
			null
		>({
			query: data => ({
				url: 'WithdrawalBlockSwitch/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetWithdrawalBlockSwitch'],
		}),
		//  Withdrawal Option Status Management - 更新提款列表(針對前台 Bank Card/E-Wallet/Crypto)
		setWithdrawalBlockSwitch: builder.mutation<
			IAxiosResponse<null>,
			ISetWithdrawalBlockSwitchArgs
		>({
			query: data => ({
				url: 'WithdrawalBlockSwitch/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetWithdrawalBlockSwitch'],
		}),
		// 取得支付三方列表
		getSystemBankInfoList: builder.query<
			IAxiosResponse<ISystemBankInfoData[]>,
			null
		>({
			query: data => ({
				url: 'BankSetting/GetSystemBankInfoList',
				method: 'POST',
				data,
			}),
			providesTags: ['SetSystemBankInfo'],
		}),
		// 設定支付三方狀態
		setSystemBankInfo: builder.mutation<
			IAxiosResponse<null>,
			ISetSystemBankInfoArgs
		>({
			query: data => ({
				url: 'BankSetting/SetSystemBankInfo',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetSystemBankInfo'],
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
	useGetWithdrawalTypeListQuery,
	useGetAutoVerifyRuleListQuery,
	useAddAutoVerifyRuleMutation,
	useSetAutoVerifyRuleMutation,
	useDeleteAutoVerifyRuleMutation,
	useGetWithdrawalBlockSwitchListQuery,
	useSetWithdrawalBlockSwitchMutation,
	useGetSystemBankInfoListQuery,
	useSetSystemBankInfoMutation,
} = paymentManagementApi
