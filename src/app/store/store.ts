import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { enumReducer } from 'common/enum'
import { baseDataApi } from 'common/service/baseDataApi'
import { homeApi } from 'common/service/homeApi/api'
import adjustmentLogReportReducer from 'features/adjustmentLogReport/slice'
import { assignBrandApi } from 'features/assignBrand/api'
import { blockBankAccountApi } from 'features/blockBankAccount/api'
import { blockIpApi } from 'features/blockIp/api'
import { dashboardSlice } from 'features/dashboard'
import { depositAccountingApi } from 'features/depositAccounting/api'
import { referralManagementApi } from 'features/referralManagement/api'
import roleManagementReducer from 'features/roleManagement/slice'
import { userSettingsApi } from 'features/userSettings/api'

export const store = configureStore({
	reducer: {
		allEnum: enumReducer,
		dashboard: dashboardSlice,
		roleManagement: roleManagementReducer,
		adjustmentLogReport: adjustmentLogReportReducer,
		[homeApi.reducerPath]: homeApi.reducer,
		[baseDataApi.reducerPath]: baseDataApi.reducer,
		[userSettingsApi.reducerPath]: userSettingsApi.reducer,
		[blockBankAccountApi.reducerPath]: blockBankAccountApi.reducer,
		[blockIpApi.reducerPath]: blockIpApi.reducer,
		[depositAccountingApi.reducerPath]: depositAccountingApi.reducer,
		[assignBrandApi.reducerPath]: assignBrandApi.reducer,
		[referralManagementApi.reducerPath]: referralManagementApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		})
			.concat(homeApi.middleware)
			.concat(baseDataApi.middleware)
			.concat(userSettingsApi.middleware)
			.concat(blockBankAccountApi.middleware)
			.concat(blockIpApi.middleware)
			.concat(depositAccountingApi.middleware)
			.concat(assignBrandApi.middleware)
			.concat(referralManagementApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>
