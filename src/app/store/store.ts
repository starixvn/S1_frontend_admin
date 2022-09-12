import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { enumReducer } from 'common/enum'
import { baseDataApi } from 'common/service/baseDataApi'
import { allDataApi } from 'common/service/allDataApi'
import { enumApi } from 'common/service/enumApi'
import { homeApi } from 'common/service/homeApi/api'
import { permissionApi } from 'common/service/permissionApi/api'
import adjustmentLogReportReducer from 'features/adjustmentLogReport/slice'
import { assignBrandApi } from 'features/assignBrand/api'
import { blockBankAccountApi } from 'features/blockBankAccount/api'
import { blockIpApi } from 'features/blockIp/api'
import { referralReportApi } from 'features/referralReport/api'
import { vipRebateManagementApi } from 'features/vipRebateManagement/api'
import { dashboardSlice } from 'features/dashboard'
import { depositAccountingApi } from 'features/depositAccounting/api'
import { referralManagementApi } from 'features/referralManagement/api'
import roleManagementReducer from 'features/roleManagement/slice'
import { userSettingsApi } from 'features/userSettings/api'
import { inactivePointExpiryApi } from 'features/inactivePointExpiry/api'
import { redemptionLimitApi } from 'features/redemptionLimit/api'
import { depositPointApi } from 'features/depositPoint/api'
import { giftListingApi } from 'features/giftListing/api'
import { memberListApi } from 'features/memberList/api'
import { betListApi } from 'features/betList/api'
import { turnoverPointApi } from 'features/turnoverPoint/api'
import { worldCupTeamReportApi } from 'features/worldCupTeamReport/api'
import { worldCupMemberReportApi } from 'features/worldCupMemberReport/api'
import { worldCupSettingApi } from 'features/worldCupSetting/api'
import { redemptionListingApi } from 'features/redemptionListing/api'
import { siteMaintenanceApi } from 'features/siteMaintenance/api'
import { adjustmentPointReportApi } from 'features/adjustmentPointReport/api'
import { depositPointReportApi } from 'features/depositPointReport/api'
import { blockEWalletApi } from 'features/blockEWallet/api'
import { thirdPartyAdjustmentApi } from 'features/balanceAdjustment/thirdPartyAdjustment/api'
import { specialPasswordApi } from 'features/specialPasswordManagement/api'
import { balanceAdjustmentApi } from 'features/balanceAdjustment/balanceAdjustment/api'
import { eWalletSettingApi } from 'features/eWalletSetting/api'
import { verificationManagementApi } from 'features/verificationManagement/api'
import { turnoverPointReportApi } from 'features/turnoverPointReport/api'
import { transferAccountManagementApi } from 'features/transferAccountManagement/api'
import { snsManagementApi } from 'features/snsManagement/api'
import { bonusExportApi } from 'features/bonusExport/api'
import { lineDepositChannelApi } from 'features/lineDepositChannel/api'
import { withdrawalSubmissionApi } from 'features/withdrawalSubmission/api'
import { bankCardManagementApi } from 'features/bankCardManagement/api'
import { liveRegistrationStatisticsApi } from 'features/liveRegistrationStatistics/api'
import { withdrawalLimitationApi } from 'features/withdrawalLimitation/api'
import { depositLimitationApi } from 'features/depositLimitation/api'
import { hotEventManagementApi } from 'features/hotEventManagement/api'
import { issueBonusManagementApi } from 'features/issueBonusManagement/api'

export const store = configureStore({
	reducer: {
		allEnum: enumReducer,
		dashboard: dashboardSlice,
		roleManagement: roleManagementReducer,
		adjustmentLogReport: adjustmentLogReportReducer,
		[enumApi.reducerPath]: enumApi.reducer,
		[homeApi.reducerPath]: homeApi.reducer,
		[baseDataApi.reducerPath]: baseDataApi.reducer,
		[allDataApi.reducerPath]: allDataApi.reducer,
		[permissionApi.reducerPath]: permissionApi.reducer,
		[userSettingsApi.reducerPath]: userSettingsApi.reducer,
		[blockBankAccountApi.reducerPath]: blockBankAccountApi.reducer,
		[blockIpApi.reducerPath]: blockIpApi.reducer,
		[depositAccountingApi.reducerPath]: depositAccountingApi.reducer,
		[assignBrandApi.reducerPath]: assignBrandApi.reducer,
		[referralManagementApi.reducerPath]: referralManagementApi.reducer,
		[referralReportApi.reducerPath]: referralReportApi.reducer,
		[inactivePointExpiryApi.reducerPath]: inactivePointExpiryApi.reducer,
		[vipRebateManagementApi.reducerPath]: vipRebateManagementApi.reducer,
		[redemptionLimitApi.reducerPath]: redemptionLimitApi.reducer,
		[depositPointApi.reducerPath]: depositPointApi.reducer,
		[turnoverPointApi.reducerPath]: turnoverPointApi.reducer,
		[memberListApi.reducerPath]: memberListApi.reducer,
		[giftListingApi.reducerPath]: giftListingApi.reducer,
		[betListApi.reducerPath]: betListApi.reducer,
		[worldCupTeamReportApi.reducerPath]: worldCupTeamReportApi.reducer,
		[worldCupMemberReportApi.reducerPath]: worldCupMemberReportApi.reducer,
		[worldCupSettingApi.reducerPath]: worldCupSettingApi.reducer,
		[redemptionListingApi.reducerPath]: redemptionListingApi.reducer,
		[siteMaintenanceApi.reducerPath]: siteMaintenanceApi.reducer,
		[adjustmentPointReportApi.reducerPath]: adjustmentPointReportApi.reducer,
		[depositPointReportApi.reducerPath]: depositPointReportApi.reducer,
		[blockEWalletApi.reducerPath]: blockEWalletApi.reducer,
		[specialPasswordApi.reducerPath]: specialPasswordApi.reducer,
		[eWalletSettingApi.reducerPath]: eWalletSettingApi.reducer,
		[balanceAdjustmentApi.reducerPath]: balanceAdjustmentApi.reducer,
		[thirdPartyAdjustmentApi.reducerPath]: thirdPartyAdjustmentApi.reducer,
		[verificationManagementApi.reducerPath]: verificationManagementApi.reducer,
		[turnoverPointReportApi.reducerPath]: turnoverPointReportApi.reducer,
		[transferAccountManagementApi.reducerPath]:
			transferAccountManagementApi.reducer,
		[snsManagementApi.reducerPath]: snsManagementApi.reducer,
		[bonusExportApi.reducerPath]: bonusExportApi.reducer,
		[lineDepositChannelApi.reducerPath]: lineDepositChannelApi.reducer,
		[withdrawalSubmissionApi.reducerPath]: withdrawalSubmissionApi.reducer,
		[bankCardManagementApi.reducerPath]: bankCardManagementApi.reducer,
		[liveRegistrationStatisticsApi.reducerPath]:
			liveRegistrationStatisticsApi.reducer,
		[withdrawalLimitationApi.reducerPath]: withdrawalLimitationApi.reducer,
		[depositLimitationApi.reducerPath]: depositLimitationApi.reducer,
		[issueBonusManagementApi.reducerPath]: issueBonusManagementApi.reducer,
		[hotEventManagementApi.reducerPath]: hotEventManagementApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		})
			.concat(enumApi.middleware)
			.concat(homeApi.middleware)
			.concat(baseDataApi.middleware)
			.concat(allDataApi.middleware)
			.concat(permissionApi.middleware)
			.concat(userSettingsApi.middleware)
			.concat(blockBankAccountApi.middleware)
			.concat(blockIpApi.middleware)
			.concat(depositAccountingApi.middleware)
			.concat(assignBrandApi.middleware)
			.concat(referralManagementApi.middleware)
			.concat(referralReportApi.middleware)
			.concat(inactivePointExpiryApi.middleware)
			.concat(vipRebateManagementApi.middleware)
			.concat(redemptionLimitApi.middleware)
			.concat(depositPointApi.middleware)
			.concat(turnoverPointApi.middleware)
			.concat(memberListApi.middleware)
			.concat(giftListingApi.middleware)
			.concat(betListApi.middleware)
			.concat(worldCupTeamReportApi.middleware)
			.concat(worldCupTeamReportApi.middleware)
			.concat(worldCupMemberReportApi.middleware)
			.concat(worldCupSettingApi.middleware)
			.concat(redemptionListingApi.middleware)
			.concat(siteMaintenanceApi.middleware)
			.concat(adjustmentPointReportApi.middleware)
			.concat(depositPointReportApi.middleware)
			.concat(blockEWalletApi.middleware)
			.concat(specialPasswordApi.middleware)
			.concat(eWalletSettingApi.middleware)
			.concat(balanceAdjustmentApi.middleware)
			.concat(thirdPartyAdjustmentApi.middleware)
			.concat(verificationManagementApi.middleware)
			.concat(turnoverPointReportApi.middleware)
			.concat(transferAccountManagementApi.middleware)
			.concat(snsManagementApi.middleware)
			.concat(bonusExportApi.middleware)
			.concat(lineDepositChannelApi.middleware)
			.concat(withdrawalSubmissionApi.middleware)
			.concat(bankCardManagementApi.middleware)
			.concat(issueBonusManagementApi.middleware)
			.concat(liveRegistrationStatisticsApi.middleware)
			.concat(withdrawalLimitationApi.middleware)
			.concat(depositLimitationApi.middleware)
			.concat(hotEventManagementApi.middleware),
})

// to ignore : TS2589: Type instantiation is excessively deep and possibly infinite.
// @ts-ignore
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>
