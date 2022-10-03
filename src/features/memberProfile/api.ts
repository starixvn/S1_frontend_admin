import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IAddCustNoteArgs,
	IDeleteCustPhotoIdArgs,
	IGetBasicInfoArgs,
	IGetBasicInfoResponse,
	IGetCustNotesArgs,
	IGetCustNotesResponse,
	IGetCustPhotoIdArgs,
	IGetCustPhotoResponse,
	IGetReferralHistoryArgs,
	IGetReferralHistoryResponse,
	IGetVipLevelLogArgs,
	IGetVipLevelLogResponse,
	ISetCustNoteArgs,
	IBonusWalletDetailData,
	IBonusWalletInfoData,
	ICustIdInterface,
	ICustTpWalletData,
	IGetDeviceData,
	IGetIpCountData,
	ITodayInfoData,
	IWalletBalanceInfoData,
	IWinLossInfoData,
	IWinLossSummaryData,
} from 'features/memberProfile/type'

export const memberProfileApi = createApi({
	reducerPath: 'memberProfileApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['EditPhoto', 'BasicInfoMutation', 'SetCustomerNote'],
	endpoints: builder => ({
		// sider基本資料
		getBasicInfo: builder.query<IGetBasicInfoResponse, IGetBasicInfoArgs>({
			query: data => ({
				url: 'Member/GetBasicInfo',
				method: 'POST',
				data,
			}),
			providesTags: ['BasicInfoMutation'],
		}),
		// sider 內 custPhoto
		getCustPhoto: builder.query<IGetCustPhotoResponse, IGetCustPhotoIdArgs>({
			query: data => ({
				url: 'Member/GetCustPhotoId',
				method: 'POST',
				data,
			}),
			providesTags: ['EditPhoto'],
		}),
		// 刪除 sider 內 custPhoto (單張)
		deleteCustPhoto: builder.mutation<void, IDeleteCustPhotoIdArgs>({
			query: data => ({
				url: 'Member/DeleteCustPhotoId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['EditPhoto'],
		}),
		// 上傳 sider 內 custPhoto (單張)
		uploadCustPhoto: builder.mutation<void, FormData>({
			query: data => ({
				url: 'Member/UploadCustPhotoId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['EditPhoto'],
		}),
		// 取消 Line 綁定
		lineUnbind: builder.mutation<void, IGetBasicInfoArgs>({
			query: data => ({
				url: 'Member/LineUnbind',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		// 取得 VipLevel Log 頁面資料
		getVipLevelLog: builder.query<IGetVipLevelLogResponse, IGetVipLevelLogArgs>(
			{
				query: data => ({
					url: 'customerManage/GetVipLevelLogByCustId',
					method: 'POST',
					data,
				}),
			}
		),
		// CustomerInfo => ReferralHistory 頁面
		getReferralHistoryLog: builder.query<
			IGetReferralHistoryResponse,
			IGetReferralHistoryArgs
		>({
			query: data => ({
				url: 'customerManage/GetRefFriendByCustId',
				method: 'POST',
				data,
			}),
		}),
		// CustomerInfo => Notes 頁面
		getCustNotes: builder.query<IGetCustNotesResponse, IGetCustNotesArgs>({
			query: data => ({
				url: 'customerManage/GetCustNote',
				method: 'POST',
				data,
			}),
			providesTags: ['SetCustomerNote'],
		}),
		addCustNotes: builder.mutation<void, IAddCustNoteArgs>({
			query: data => ({
				url: 'customerManage/AddCustNote',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetCustomerNote'],
		}),
		setCustNotes: builder.mutation<void, ISetCustNoteArgs>({
			query: data => ({
				url: 'customerManage/SetCustNote',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetCustomerNote'],
		}),
		// * 取得客戶今日 Dashboard，用於 Dashboard 區塊
		getTodayInfo: builder.query<
			IAxiosResponse<ITodayInfoData>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'CustomerManage/GetTodayDashboard',
				method: 'POST',
				data,
			}),
		}),
		// * 取得客戶 Bonus 錢包資訊，用於 Dashboard 區塊
		getBonusWalletInfo: builder.query<
			// * 這裡的 response 固定回傳長度 1 的資料陣列
			IAxiosResponse<IBonusWalletInfoData[]>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'CustomerManage/GetBonusByCustId',
				method: 'POST',
				data,
			}),
		}),
		// * 取得客戶 Bonus 錢包細項，用於 Dashboard 區塊
		getBonusWalletDetail: builder.query<
			IAxiosResponse<IBonusWalletDetailData>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'CustomerManage/GetCustInfoDetail',
				method: 'POST',
				data,
			}),
		}),
		// * 取得客戶資料及主錢包餘額，用於 Dashboard 區塊
		getCustTpWallet: builder.query<
			IAxiosResponse<ICustTpWalletData>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'CustomerManage/GetCustTPWallet',
				method: 'POST',
				data,
			}),
		}),
		// * 取得客戶餘額
		getWalletBalanceInfo: builder.query<
			IAxiosResponse<IWalletBalanceInfoData>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'Member/GetCustomerBalanceInfo',
				method: 'POST',
				data,
			}),
		}),
		getWinLossInfo: builder.query<
			IAxiosResponse<IWinLossInfoData>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'CustomerManage/GetDashboardWinLossGroup',
				method: 'POST',
				data,
			}),
		}),
		getWinLoseSummaries: builder.query<
			IAxiosResponse<IWinLossSummaryData[]>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'CustomerManage/GetWinLoseSummary',
				method: 'POST',
				data,
			}),
		}),
		getFinancialLog: builder.query<
			IAxiosResponse<IWinLossSummaryData[]>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'CustomerManage/GetFinancialLogByCustId',
				method: 'POST',
				data,
			}),
		}),
		getIpCountList: builder.query<
			IAxiosResponse<IGetIpCountData[]>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'Member/GetIpList',
				method: 'POST',
				data,
			}),
		}),
		getDeviceList: builder.query<
			IAxiosResponse<IGetDeviceData[]>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'Member/GetDeviceList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useGetBasicInfoQuery,
	useGetCustPhotoQuery,
	useDeleteCustPhotoMutation,
	useUploadCustPhotoMutation,
	useLineUnbindMutation,
	useLazyGetVipLevelLogQuery,
	useLazyGetReferralHistoryLogQuery,
	useLazyGetCustNotesQuery,
	useAddCustNotesMutation,
	useSetCustNotesMutation,
	useGetTodayInfoQuery,
	useGetBonusWalletDetailQuery,
	useGetBonusWalletInfoQuery,
	useGetCustTpWalletQuery,
	useGetWalletBalanceInfoQuery,
	useGetWinLossInfoQuery,
	useGetWinLoseSummariesQuery,
	useGetFinancialLogQuery,
	useGetIpCountListQuery,
	useGetDeviceListQuery,
} = memberProfileApi
