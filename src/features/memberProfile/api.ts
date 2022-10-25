import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IAddCustNoteArgs,
	IDeleteCustPhotoIdArgs,
	IDeletePersonalMsgArgs,
	IGetBasicInfoArgs,
	IGetBasicInfoResponse,
	IGetCustNotesArgs,
	IGetCustNotesResponse,
	IGetCustPhotoIdArgs,
	IGetCustPhotoResponse,
	IGetLoginLogArgs,
	IGetLoginLogResponse,
	IGetReferralHistoryArgs,
	IGetReferralHistoryResponse,
	IGetSMSInfoArgs,
	IGetSmsInfoResponse,
	IGetVipLevelLogArgs,
	IGetVipLevelLogResponse,
	ISendPersonalMsgArgs,
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
	IGetFinancialLogArgs,
	IFinancialLogsResponse,
	PayoutVerificationRewardOTPTypeEnum,
	ITagData,
	VIPLevelSettingEnumData,
	VIPLevelLogByCustData,
	VIPLevelInfoByCustIdResponse,
	IGetIpLogArgs,
	IGetIpLogResponse,
	IGetIpUserListArgs,
	IGetIpUserListResponse,
	IGetBonusLogArgs,
	IGetBonusLogResponse,
	IGetVipRebateLogArgs,
	IGetVipRebateLogData,
	IGetRewardPointLogArgs,
	IGetRewardPointLogResponse,
	IGetPromotionReportArgs,
	IGetPromotionReportResponse,
	IGetDeviceUserListArgs,
	ICancelBonusArgs,
	IGetThirdPartyAccountData,
	IGetGameTypeListArgs,
	IGetGameTypeListData,
	IGetWinLossSummaryDetailArgs,
	IGetWinLossSummaryDetailData,
	IGetDepositInfoArgs,
	IGetDepositInfoResponse,
	IGetWithdrawalInfoArgs,
	IGetWithdrawalInfoResponse,
	IGetAdjustmentInfoResponse,
	IGetAdjustmentInfoArgs,
	IGetTransferInfoArgs,
	IGetTransferInfoResponse,
	IGetTpAdjustmentLogResponse,
	IGetTpAdjustmentLogArgs,
	IExportFinancialLogArgs,
	IGetBankInfoResponse,
	IGetBankInfoArgs,
	IGetEWalletInfoResponse,
	IGetEWalletInfoArgs,
	IGetCryptoLogResponse,
	IGetCryptoLogArgs,
	IGetBankListArgs,
	IGetBankListResponse,
	IGetEWalletListArgs,
	IGetEWalletListResponse,
	IGetTurnoverArgs,
	IGetTurnoverData,
	IGetCustTpBetRecordArgs,
	IGetCustTpBetRecordData,
	IGetCustTpBetRecordByDayArgs,
	IGetCustTpBetRecordByDayData,
	IGetCustTpBetRecordByCategoryIdArgs,
	IGetCustTpBetRecordByCategoryIdData,
	IGetCustTpBetRecordByGameTypeArgs,
	IGetCustTpBetRecordByGameTypeData,
	IGetTpBetRecordDetailArgs,
	IGetTpBetRecordDetailData,
	IGetPromotionCashBackData,
	IGetPromotionDetailArgs,
	IGetPromotionDetailData,
	IGetVipRebateDetailArgs,
	IGetVipRebateDetailData,
	IGetWithdrawalLimitLogResponse,
	IGetWithdrawalLimitLogArgs,
} from 'features/memberProfile/type'

export const memberProfileApi = createApi({
	reducerPath: 'memberProfileApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: [
		'EditPhoto',
		'BasicInfoMutation',
		'SetCustomerNote',
		'SetSMSInfo',
		'SetVipLevel',
		'SetPromotionReport',
	],
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
		getFinancialLogs: builder.query<
			IFinancialLogsResponse,
			IGetFinancialLogArgs
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
		editFullName: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				fullName: string
			}
		>({
			query: data => ({
				url: 'Member/EditFullName',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		editEmailName: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				email: string
			}
		>({
			query: data => ({
				url: 'Member/EditEmail',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		editPhoneNo: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				phoneNo: string
			}
		>({
			query: data => ({
				url: 'Member/EditPhoneNo',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		editBirthday: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				birthDate: number
				birthMonth: number
				birthYear: number
			}
		>({
			query: data => ({
				url: 'Member/EditBirthday',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		editAddress: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				country: string
				state: string
				postCode: string
				city: string
				line1: string
				line2: string
			}
		>({
			query: data => ({
				url: 'Member/EditAddress',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		switchIsKyc: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				status: number
			}
		>({
			query: data => ({
				url: 'Member/SwitchKyc',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		switchRisk: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				status: number
			}
		>({
			query: data => ({
				url: 'Member/SwitchRisk',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		switchPhoneVerified: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				status: number
			}
		>({
			query: data => ({
				url: 'Member/SwitchPhoneVerified',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		switchEmailVerified: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				status: number
			}
		>({
			query: data => ({
				url: 'Member/SwitchEmailVerified',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		resetPassword: builder.mutation<
			IAxiosResponse<string>,
			{
				custId: number
			}
		>({
			query: data => ({
				url: 'Member/ResetPassword',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		lockAccount: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				status: number
				reason: string
			}
		>({
			query: data => ({
				url: 'Member/Lock',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		closeAccount: builder.mutation<
			IAxiosResponse<void>,
			{ custId: number; reason: string }
		>({
			query: data => ({
				url: 'Member/Close',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		kickOutUser: builder.mutation<
			IAxiosResponse<string>,
			{
				custId: number
				reason: string
			}
		>({
			query: data => ({
				url: 'Member/KickOut',
				method: 'POST',
				data,
			}),
		}),
		// CustomerInfo => LoginLog 頁面
		getLoginLog: builder.query<IGetLoginLogResponse, IGetLoginLogArgs>({
			query: data => ({
				url: 'Member/GetLoginLog',
				method: 'POST',
				data,
			}),
		}),
		resetBankInfo: builder.mutation<IAxiosResponse<void>, { custId: number }>({
			query: data => ({
				url: 'Member/ResetBankInfo',
				method: 'POST',
				data,
			}),
		}),
		// CustomerInfo => SMSInfo 頁面
		getSmsInfo: builder.query<IGetSmsInfoResponse, IGetSMSInfoArgs>({
			query: data => ({
				url: 'CustomerManage/GetPersonalMsg',
				method: 'POST',
				data,
			}),
			providesTags: ['SetSMSInfo'],
		}),
		sendPersonalMsg: builder.mutation<void, ISendPersonalMsgArgs>({
			query: data => ({
				url: 'CustomerManage/SendPersonalMsg',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetSMSInfo'],
		}),
		deletePersonalMsg: builder.mutation<void, IDeletePersonalMsgArgs>({
			query: data => ({
				url: 'CustomerManage/DeletePersonalMsg',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetSMSInfo'],
		}),
		// CustomerInfo => IP List 頁面
		getIpLog: builder.query<IGetIpLogResponse, IGetIpLogArgs>({
			query: data => ({
				url: 'CustomerManage/GetIPLog',
				method: 'POST',
				data,
			}),
		}),
		resetEWallet: builder.mutation<IAxiosResponse<void>, { custId: number }>({
			query: data => ({
				url: 'Member/ResetEWallet',
				method: 'POST',
				data,
			}),
		}),
		// 取得關聯 IP 的帳號
		getIpUser: builder.query<IGetIpUserListResponse, IGetIpUserListArgs>({
			query: data => ({
				url: 'Block/GetIPUserList',
				method: 'POST',
				data,
			}),
		}),
		resetCryptoInfo: builder.mutation<IAxiosResponse<void>, { custId: number }>(
			{
				query: data => ({
					url: 'Member/ResetCryptoInfo',
					method: 'POST',
					data,
				}),
			}
		),
		switchRebatePayout: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				status: number
			}
		>({
			query: data => ({
				url: 'Member/SwitchRebatePayout',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		setPayoutVerificationReward: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				OTPType: PayoutVerificationRewardOTPTypeEnum
			}
		>({
			query: data => ({
				url: 'Member/PayoutVerificationReward',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		getAllTags: builder.query<IAxiosResponse<ITagData[]>, null>({
			query: () => ({
				url: 'TagManagement/GetAllTag',
				method: 'POST',
			}),
		}),
		removeTag: builder.mutation<
			IAxiosResponse<void>,
			{ custId: number; tagId: number }
		>({
			query: data => ({
				url: 'Member/RemoveTag',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		addTag: builder.mutation<
			IAxiosResponse<void>,
			{ custId: number; tagId: number }
		>({
			query: data => ({
				url: 'Member/AddTag',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['BasicInfoMutation'],
		}),
		// * VIP Level Setting
		// * 取得VIP等級設定資料 enum
		getVipLevelSettingEnum: builder.query<
			IAxiosResponse<VIPLevelSettingEnumData[]>,
			{ siteId: number | undefined }
		>({
			query: data => ({
				url: 'VipLevel/GetSetting',
				method: 'POST',
				data,
			}),
		}),
		// 取得 bonusLog
		getBonusLog: builder.query<IGetBonusLogResponse, IGetBonusLogArgs>({
			query: data => ({
				url: 'CustomerManage/GetBonusLogByCustId',
				method: 'POST',
				data,
			}),
		}),
		// * 取得指定客戶 VIP 等級資料
		getVipLevelInfoByCustId: builder.query<
			VIPLevelInfoByCustIdResponse,
			{ custId: number }
		>({
			query: data => ({
				url: 'Member/GetVipLevelInfo',
				method: 'POST',
				data,
			}),
			providesTags: ['SetVipLevel'],
		}),
		// * 取得指定客戶 VIP 等級紀錄
		getVipLevelLogByCustId: builder.query<
			IAxiosResponse<VIPLevelLogByCustData[]>,
			{ custId: number }
		>({
			query: data => ({
				url: 'Member/GetVipLevelLog',
				method: 'POST',
				data,
			}),
			providesTags: ['SetVipLevel'],
		}),
		// * 設定指定客戶VIP等級
		setVipLevel: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				vipLevel: number
			}
		>({
			query: data => ({
				url: 'Member/SetVipLevel',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetVipLevel'],
		}),
		// * 設定VIP等級為手動，manually:0 關, 1:開
		setVipLevelManually: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				manually: number
			}
		>({
			query: data => ({
				url: 'Member/SetVipLevelManually',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetVipLevel'],
		}),
		// Marketing => VipRebateLog 頁面
		getVipRebateLog: builder.query<
			IAxiosResponse<IGetVipRebateLogData[]>,
			IGetVipRebateLogArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetVipRebateInfoByCustId',
				method: 'POST',
				data,
			}),
		}),
		getVipRebateDetail: builder.query<
			IAxiosResponse<IGetVipRebateDetailData[]>,
			IGetVipRebateDetailArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetVipRebateDetail',
				method: 'POST',
				data,
			}),
		}),
		// Marketing => RewardPointLog
		getRewardPointLog: builder.query<
			IGetRewardPointLogResponse,
			IGetRewardPointLogArgs
		>({
			query: data => ({
				url: 'StorePoint/GetMemberRewardPointLog',
				method: 'POST',
				data,
			}),
		}),
		// Marketing => PromotionReport
		getPromotionReport: builder.query<
			IGetPromotionReportResponse,
			IGetPromotionReportArgs
		>({
			query: data => ({
				url: 'Member/GetPromotionByCustId',
				method: 'POST',
				data,
			}),
			providesTags: ['SetPromotionReport'],
		}),
		cancelPromotion: builder.mutation<void, ICancelBonusArgs>({
			query: data => ({
				url: 'Member/CancelBonusByBonusId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['SetPromotionReport'],
		}),
		getDeviceUserList: builder.query<
			IGetIpUserListResponse,
			IGetDeviceUserListArgs
		>({
			query: data => ({
				url: 'Block/GetDeviceUserList',
				method: 'POST',
				data,
			}),
		}),
		getDepositInfo: builder.query<IGetDepositInfoResponse, IGetDepositInfoArgs>(
			{
				query: data => ({
					url: 'CustomerManage/GetDepositInfoByCustId',
					method: 'POST',
					data,
				}),
			}
		),
		// GameLog => 3RDParty
		getThirdPartyAccount: builder.query<
			IAxiosResponse<IGetThirdPartyAccountData[]>,
			ICustIdInterface
		>({
			query: data => ({
				url: 'Member/GetThirdPartyAccount',
				method: 'POST',
				data,
			}),
		}),
		// GameLog => WinLossSummary 取得GameTypeList
		getGameTypeList: builder.query<
			IAxiosResponse<IGetGameTypeListData[]>,
			IGetGameTypeListArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetGameTypeList',
				method: 'POST',
				data,
			}),
		}),
		// GameLog => WinLossSummary 取得 WinLossSummary Detail
		getWinLossSummaryDetail: builder.query<
			IAxiosResponse<IGetWinLossSummaryDetailData[]>,
			IGetWinLossSummaryDetailArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetWinLoseSummaryDetail',
				method: 'POST',
				data,
			}),
		}),
		getWithdrawalInfo: builder.query<
			IGetWithdrawalInfoResponse,
			IGetWithdrawalInfoArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetWithdrawalInfoByCustId',
				method: 'POST',
				data,
			}),
		}),
		getAdjustmentInfo: builder.query<
			IGetAdjustmentInfoResponse,
			IGetAdjustmentInfoArgs
		>({
			query: data => ({
				url: 'Member/GetAdjustmentInfoByCustId',
				method: 'POST',
				data,
			}),
		}),
		GetTpAdjustmentLog: builder.query<
			IGetTpAdjustmentLogResponse,
			IGetTpAdjustmentLogArgs
		>({
			query: data => ({
				url: 'Member/GetCustTpAdjustmentLog',
				method: 'POST',
				data,
			}),
		}),
		getWithdrawalLimitLog: builder.query<
			IGetWithdrawalLimitLogResponse,
			IGetWithdrawalLimitLogArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetWithdrawalLimitLog',
				method: 'POST',
				data,
			}),
		}),
		getTransferInfo: builder.query<
			IGetTransferInfoResponse,
			IGetTransferInfoArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetTpTransferInfoByCustId',
				method: 'POST',
				data,
			}),
		}),
		exportFinancialLog: builder.mutation<Blob, IExportFinancialLogArgs>({
			query: data => ({
				url: 'CustomerManage/GetFinancialLogByCustIdExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getBankInfo: builder.query<IGetBankInfoResponse, IGetBankInfoArgs>({
			query: data => ({
				url: 'CustomerManage/GetBankInfoLogByCustId',
				method: 'POST',
				data,
			}),
		}),
		getEWalletLog: builder.query<IGetEWalletInfoResponse, IGetEWalletInfoArgs>({
			query: data => ({
				url: 'CustomerManage/GetEWalletLog',
				method: 'POST',
				data,
			}),
		}),
		getCryptoLog: builder.query<IGetCryptoLogResponse, IGetCryptoLogArgs>({
			query: data => ({
				url: 'CustomerManage/GetCryptoWalletLogByCustId',
				method: 'POST',
				data,
			}),
		}),
		getBankList: builder.query<IGetBankListResponse, IGetBankListArgs>({
			query: data => ({
				url: 'CustomerManage/GetBankList',
				method: 'POST',
				data,
			}),
		}),
		getEWalletList: builder.query<IGetEWalletListResponse, IGetEWalletListArgs>(
			{
				query: data => ({
					url: 'CustomerManage/GetEWalletList',
					method: 'POST',
					data,
				}),
			}
		),
		// GameLog => Turnover
		getTurnoverByCustId: builder.query<
			IAxiosResponse<IGetTurnoverData[]>,
			IGetTurnoverArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetTurnOverByCustId',
				method: 'POST',
				data,
			}),
		}),
		// GameLog => Statement
		// 第一層 , 取得客戶紀錄
		getCustTpBetRecord: builder.query<
			IAxiosResponse<IGetCustTpBetRecordData[]>,
			IGetCustTpBetRecordArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetCustTpBetRecord',
				method: 'POST',
				data,
			}),
		}),
		// 第二層 , 取得客戶指定日期紀錄
		getCustTpBetRecordByDay: builder.query<
			IAxiosResponse<IGetCustTpBetRecordByDayData[]>,
			IGetCustTpBetRecordByDayArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetCustTpBetRecordByDay',
				method: 'POST',
				data,
			}),
		}),
		// 第三層 , 取得客戶指定 category 紀錄
		getCustTpBetRecordByCategory: builder.query<
			IAxiosResponse<IGetCustTpBetRecordByCategoryIdData[]>,
			IGetCustTpBetRecordByCategoryIdArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetCustTpBetRecordByCategoryId',
				method: 'POST',
				data,
			}),
		}),
		// 第四層 , 取得客戶指定 GameType 紀錄
		getCustTpBetRecordByGameType: builder.query<
			IAxiosResponse<IGetCustTpBetRecordByGameTypeData[]>,
			IGetCustTpBetRecordByGameTypeArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetCustTpBetRecordDetailByGameType',
				method: 'POST',
				data,
			}),
		}),
		// 第五層 , 取得第三方細單
		getTpBetRecordDetail: builder.query<
			IAxiosResponse<IGetTpBetRecordDetailData>,
			IGetTpBetRecordDetailArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetTpBetRecordDetail',
				method: 'POST',
				data,
			}),
		}),
		// Marketing => CashBack Report
		getPromotionCashBack: builder.query<
			IAxiosResponse<IGetPromotionCashBackData[]>,
			ICustIdInterface
		>({
			// 取上方 CashBack Info
			query: data => ({
				url: 'Member/GetPromotionCashback',
				method: 'POST',
				data,
			}),
		}),
		getPromotionDetail: builder.query<
			IAxiosResponse<IGetPromotionDetailData>,
			IGetPromotionDetailArgs
		>({
			query: data => ({
				url: 'Member/GetPromotionDetail',
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
	useLazyGetLoginLogQuery,
	useLazyGetSmsInfoQuery,
	useSendPersonalMsgMutation,
	useDeletePersonalMsgMutation,
	useGetTodayInfoQuery,
	useGetBonusWalletDetailQuery,
	useGetBonusWalletInfoQuery,
	useGetCustTpWalletQuery,
	useGetWalletBalanceInfoQuery,
	useGetWinLossInfoQuery,
	useGetWinLoseSummariesQuery,
	useLazyGetFinancialLogsQuery,
	useGetIpCountListQuery,
	useGetDeviceListQuery,
	useEditFullNameMutation,
	useEditEmailNameMutation,
	useEditPhoneNoMutation,
	useEditBirthdayMutation,
	useEditAddressMutation,
	useSwitchIsKycMutation,
	useSwitchRiskMutation,
	useSwitchPhoneVerifiedMutation,
	useSwitchEmailVerifiedMutation,
	useResetPasswordMutation,
	useLockAccountMutation,
	useCloseAccountMutation,
	useKickOutUserMutation,
	useResetBankInfoMutation,
	useResetEWalletMutation,
	useResetCryptoInfoMutation,
	useSwitchRebatePayoutMutation,
	useSetPayoutVerificationRewardMutation,
	useLazyGetAllTagsQuery,
	useRemoveTagMutation,
	useAddTagMutation,
	useLazyGetVipLevelSettingEnumQuery,
	useLazyGetVipLevelInfoByCustIdQuery,
	useLazyGetVipLevelLogByCustIdQuery,
	useSetVipLevelMutation,
	useSetVipLevelManuallyMutation,
	useLazyGetIpLogQuery,
	useLazyGetIpUserQuery,
	useLazyGetDepositInfoQuery,
	useLazyGetWithdrawalInfoQuery,
	useLazyGetAdjustmentInfoQuery,
	useLazyGetTpAdjustmentLogQuery,
	useLazyGetWithdrawalLimitLogQuery,
	useLazyGetTransferInfoQuery,
	useExportFinancialLogMutation,
	useLazyGetBankInfoQuery,
	useLazyGetEWalletLogQuery,
	useLazyGetCryptoLogQuery,
	useLazyGetBankListQuery,
	useLazyGetEWalletListQuery,
	useLazyGetBonusLogQuery,
	useLazyGetVipRebateLogQuery,
	useLazyGetRewardPointLogQuery,
	useLazyGetPromotionReportQuery,
	useLazyGetDeviceUserListQuery,
	useCancelPromotionMutation,
	useGetThirdPartyAccountQuery,
	useLazyGetGameTypeListQuery,
	useLazyGetWinLossSummaryDetailQuery,
	useLazyGetTurnoverByCustIdQuery,
	useLazyGetCustTpBetRecordQuery,
	useLazyGetCustTpBetRecordByDayQuery,
	useLazyGetCustTpBetRecordByCategoryQuery,
	useLazyGetCustTpBetRecordByGameTypeQuery,
	useLazyGetTpBetRecordDetailQuery,
	useGetPromotionCashBackQuery,
	useLazyGetPromotionDetailQuery,
	useLazyGetVipRebateDetailQuery,
} = memberProfileApi
