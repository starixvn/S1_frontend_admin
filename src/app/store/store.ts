import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { enumReducer } from 'common/enum'
import adjustmentLogReportReducer from 'features/adjustmentLogReport/slice'
import { dashboardSlice } from 'features/dashboard'
import roleManagementReducer from 'features/roleManagement/slice'

export const store = configureStore({
	reducer: {
		allEnum: enumReducer,
		dashboard: dashboardSlice,
		roleManagement: roleManagementReducer,
		adjustmentLogReport: adjustmentLogReportReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>
