import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { filter, some } from 'lodash'
import { RequestStatusType } from 'type'
import { fetchAllEnumAsync, IAllEnumState } from './thunk'
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
	rewardsCurrencyList: number[]
	vipCurrencyList: number[]
	allSiteEnableCurrencyList: number[]
}

const initialState: EnumState = {
	status: 'idle',
	userSite: undefined,
	userSiteList: [],
	allCurrencyList: [],
	adjustmentInfoLogMenu: [],
	actionTypeList: [],
	adminUserCurrencyList: [],
	rewardsCurrencyList: [],
	vipCurrencyList: [],
	allSiteEnableCurrencyList: [],
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
					siteCurrencyList,
					rewardsCurrencyList,
					vipCurrencyList,
					allSiteEnableCurrencyList,
				} = action.payload as IAllEnumState

				state.userSiteList = userSiteList
				state.allCurrencyList = allCurrencyList
				state.adjustmentInfoLogMenu = adjustmentInfoLogMenu
				state.actionTypeList = actionTypeList
				state.adminUserCurrencyList = siteCurrencyList
				state.rewardsCurrencyList = rewardsCurrencyList
				state.vipCurrencyList = vipCurrencyList
				state.allSiteEnableCurrencyList = allSiteEnableCurrencyList
				state.status = 'succeeded'
				state.allSiteEnableCurrencyList = allSiteEnableCurrencyList
			}),
})

export const selectCurrencyListBySite = (state: RootState) => {
	const { allCurrencyList, adminUserCurrencyList } = state.allEnum

	// returns the currency of the site
	return filter(allCurrencyList, currency =>
		some(adminUserCurrencyList, iCurrency => iCurrency === currency.currencyId)
	)
}

export const selectAllSiteEnableCurrencyList = (state: RootState) => {
	const { allCurrencyList, allSiteEnableCurrencyList } = state.allEnum
	return filter(allCurrencyList, currency =>
		some(
			allSiteEnableCurrencyList,
			iCurrency => iCurrency === currency.currencyId
		)
	)
}

// * 回傳商城功能頁支援的幣別
export const selectRewardsCurrencyListBySite = (state: RootState) => {
	const { allCurrencyList, rewardsCurrencyList } = state.allEnum

	return filter(allCurrencyList, currency =>
		some(rewardsCurrencyList, iCurrency => iCurrency === currency.currencyId)
	)
}

// * 回傳 vip rebate 功能頁支援的幣別
export const selectVipCurrencyListBySite = (state: RootState) => {
	const { allCurrencyList, vipCurrencyList } = state.allEnum

	return filter(allCurrencyList, currency =>
		some(vipCurrencyList, iCurrency => iCurrency === currency.currencyId)
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

/**
 * 回傳當前品牌的所有幣別 id
 */
export const selectAdminUserCurrencyList = (state: RootState) =>
	state.allEnum.adminUserCurrencyList

export const { onChangeUserSite } = enumSlice.actions

export default enumSlice.reducer
