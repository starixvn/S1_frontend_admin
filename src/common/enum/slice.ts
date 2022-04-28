import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import _ from 'lodash'
import { RequestStatusType } from 'type'
import { fetchAllEnumAsync } from './thunk'
import {
	ActionType,
	AdjustmentInfoLogMenuItem,
	Currency,
	UserSite,
} from './type'

export interface EnumState {
	status: RequestStatusType | undefined
	userSite?: UserSite
	userSiteList: UserSite[]
	allCurrencyList: Currency[]
	adjustmentInfoLogMenu: AdjustmentInfoLogMenuItem[]
	actionTypeList: ActionType[]
}

const initialState: EnumState = {
	status: undefined,
	userSite: undefined,
	userSiteList: [],
	allCurrencyList: [],
	adjustmentInfoLogMenu: [],
	actionTypeList: [],
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
			.addCase(fetchAllEnumAsync.fulfilled, (state, action) => {
				const {
					userSiteList,
					allCurrencyList,
					adjustmentInfoLogMenu,
					actionTypeList,
				} = action.payload as EnumState
				state.status = 'idle'
				state.userSiteList = userSiteList
				state.allCurrencyList = allCurrencyList
				state.adjustmentInfoLogMenu = adjustmentInfoLogMenu
				state.actionTypeList = actionTypeList
			}),
})

export const selectCurrencyListBySite = (state: RootState) => {
	const { allCurrencyList, userSite } = state.allEnum

	if (userSite === undefined) return undefined

	// Returns the currency of the site
	return _.filter(allCurrencyList, currency =>
		_.some(
			userSite?.iCurrencyList,
			iCurrency => iCurrency === currency.currencyId
		)
	)
}

export const selectEnumStatus = (state: RootState) => state.allEnum.status

export const selectUserSite = (state: RootState) => state.allEnum.userSite

export const selectAllCurrencyList = (state: RootState) =>
	state.allEnum.allCurrencyList

export const selectAdjustmentInfoLogMenu = (state: RootState) =>
	state.allEnum.adjustmentInfoLogMenu

export const selectActionTypeList = (state: RootState) =>
	state.allEnum.actionTypeList

export const { onChangeUserSite } = enumSlice.actions

export default enumSlice.reducer
