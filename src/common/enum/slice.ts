import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { filter, some } from 'lodash'
import { RequestStatusType } from 'type'
import { fetchAllEnumAsync } from './thunk'
import {
	ActionType,
	AdjustmentInfoLogMenuItem,
	Currency,
	UserSite,
} from './type'

export interface EnumState {
	status: RequestStatusType
	userSite?: UserSite
	userSiteList: UserSite[]
	allCurrencyList: Currency[]
	adjustmentInfoLogMenu: AdjustmentInfoLogMenuItem[]
	actionTypeList: ActionType[]
	adminUserCurrencyList: number[]
}

const initialState: EnumState = {
	status: 'idle',
	userSite: undefined,
	userSiteList: [],
	allCurrencyList: [],
	adjustmentInfoLogMenu: [],
	actionTypeList: [],
	adminUserCurrencyList: [],
}

const enumSlice = createSlice({
	name: 'enum',
	initialState,
	reducers: {
		onChangeUserSite: (state, action) => {
			state.userSite = action.payload
		},
	},
	extraReducers: builder =>
		builder
			.addCase(fetchAllEnumAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(fetchAllEnumAsync.rejected, state => {
				state.status = 'failed'
			})
			.addCase(fetchAllEnumAsync.fulfilled, (state, action) => {
				const {
					userSiteList,
					allCurrencyList,
					adjustmentInfoLogMenu,
					actionTypeList,
					adminUserCurrencyList,
				} = action.payload as EnumState

				state.userSiteList = userSiteList
				state.allCurrencyList = allCurrencyList
				state.adjustmentInfoLogMenu = adjustmentInfoLogMenu
				state.actionTypeList = actionTypeList
				state.adminUserCurrencyList = adminUserCurrencyList
				state.status = 'succeeded'
			}),
})

export const selectCurrencyListBySite = (state: RootState) => {
	const { allCurrencyList, adminUserCurrencyList } = state.allEnum

	// Returns the currency of the site
	return filter(allCurrencyList, currency =>
		some(adminUserCurrencyList, iCurrency => iCurrency === currency.currencyId)
	)
}

export const selectEnumStatus = (state: RootState) => state.allEnum.status

export const selectUserSite = (state: RootState) => state.allEnum.userSite

export const selectUserSiteList = (state: RootState) =>
	state.allEnum.userSiteList

export const selectAllCurrencyList = (state: RootState) =>
	state.allEnum.allCurrencyList

export const selectAdjustmentInfoLogMenu = (state: RootState) =>
	state.allEnum.adjustmentInfoLogMenu

export const selectActionTypeList = (state: RootState) =>
	state.allEnum.actionTypeList

export const { onChangeUserSite } = enumSlice.actions

export default enumSlice.reducer
