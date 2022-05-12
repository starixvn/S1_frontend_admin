import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { enumReducer } from 'common/enum'
import adjustmentLogReportReducer from 'features/adjustmentLogReport/slice'
import { blockBankAccountApi } from 'features/blockBankAccount/api'
import { blockIpApi } from 'features/blockIp/api'
import { dashboardSlice } from 'features/dashboard'
import roleManagementReducer from 'features/roleManagement/slice'
import { userSettingsApi } from 'features/userSettings/api'

export const store = configureStore({
	reducer: {
		allEnum: enumReducer,
		dashboard: dashboardSlice,
		roleManagement: roleManagementReducer,
		adjustmentLogReport: adjustmentLogReportReducer,
		[userSettingsApi.reducerPath]: userSettingsApi.reducer,
		[blockBankAccountApi.reducerPath]: blockBankAccountApi.reducer,
		[blockIpApi.reducerPath]: blockIpApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(userSettingsApi.middleware)
			.concat(blockBankAccountApi.middleware)
			.concat(blockIpApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>
