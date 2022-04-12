import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { enumReducer } from 'common/enum'
import { dashboardSlice } from 'features/dashboard'

export const store = configureStore({
	reducer: {
		allEnum: enumReducer,
		dashboard: dashboardSlice,
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
