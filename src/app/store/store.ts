import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { enumReducer } from 'common/enum'
import { baseDataApi } from 'common/service/baseDataApi'
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

export const store = configureStore({
	reducer: {
		allEnum: enumReducer,
		dashboard: dashboardSlice,
		roleManagement: roleManagementReducer,
		adjustmentLogReport: adjustmentLogReportReducer,
		[homeApi.reducerPath]: homeApi.reducer,
		[baseDataApi.reducerPath]: baseDataApi.reducer,
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
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		})
			.concat(homeApi.middleware)
			.concat(baseDataApi.middleware)
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
			.concat(worldCupSettingApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>
