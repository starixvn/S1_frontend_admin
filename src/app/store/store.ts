import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { enumReducer } from 'common/enum'
import { rootApi } from 'common/service/rootApi/api'
import { dashboardSlice } from 'features/dashboard'

import roleManagementReducer from 'features/roleManagement/slice'

import { bonusManagementApi } from 'features/bonusManagement/api'
import { memberProfileApi } from 'features/memberProfile/api'
import { paymentManagementApi } from 'features/paymentManagement/api'
import { slotGameCategoryApi } from 'features/slotGameCategory/api'

export const store = configureStore({
	reducer: {
		allEnum: enumReducer,
		dashboard: dashboardSlice,
		roleManagement: roleManagementReducer,
		[rootApi.reducerPath]: rootApi.reducer,
		[bonusManagementApi.reducerPath]: bonusManagementApi.reducer,
		[memberProfileApi.reducerPath]: memberProfileApi.reducer,
		[paymentManagementApi.reducerPath]: paymentManagementApi.reducer,
		[slotGameCategoryApi.reducerPath]: slotGameCategoryApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		})
			.concat(rootApi.middleware)
			.concat(bonusManagementApi.middleware)
			.concat(memberProfileApi.middleware)
			.concat(paymentManagementApi.middleware)
			.concat(slotGameCategoryApi.middleware),
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
