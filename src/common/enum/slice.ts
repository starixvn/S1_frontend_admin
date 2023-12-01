import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { filter, find, some, union } from 'lodash'
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
	adminAllSiteCurrencyList: number[]
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
	adminAllSiteCurrencyList: [],
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
					allSiteCurrencyList,
					rewardsCurrencyList,
					vipCurrencyList,
					allSiteEnableCurrencyList,
				} = action.payload as IAllEnumState

				state.userSiteList = userSiteList
				state.allCurrencyList = allCurrencyList
				state.adjustmentInfoLogMenu = adjustmentInfoLogMenu
				state.actionTypeList = actionTypeList
				state.adminUserCurrencyList = siteCurrencyList
				state.adminAllSiteCurrencyList = allSiteCurrencyList
				state.rewardsCurrencyList = rewardsCurrencyList
				state.vipCurrencyList = vipCurrencyList
				state.allSiteEnableCurrencyList = allSiteEnableCurrencyList
				state.status = 'succeeded'
				state.allSiteEnableCurrencyList = allSiteEnableCurrencyList
			}),
})

// * 回傳根據 cookie siteId 過濾出來的幣別
export const selectCurrencyListBySite = (state: RootState) => {
	const { allCurrencyList, adminUserCurrencyList } = state.allEnum

	// returns the currency of the site
	return filter(allCurrencyList, currency =>
		some(adminUserCurrencyList, iCurrency => iCurrency === currency.currencyId)
	)
}

// * 回傳目前帳號所支援的品牌所支援的幣別
export const selectAdminAllSiteCurrencyList = (state: RootState) => {
	return state.allEnum.adminAllSiteCurrencyList
}

// * 回傳所有支援換匯的幣別
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

/**
 *  根據已選擇品牌回傳「已選擇品牌」的所有幣別
 */
export const selectCurrencyIdsBySiteIds = (
	state: RootState,
	siteIds: number[]
) => {
	const { allCurrencyList } = state.allEnum
	// * 根據已選擇品牌 (siteIds) 連集出所有支援幣別
	const currencyIds = union(
		siteIds.flatMap(
			siteId => find(state.allEnum.userSiteList, { siteId })?.iCurrencyList
		)
	)
	// * 根據幣別陣列撈出幣別資訊
	let result: Currency[] = []
	currencyIds.forEach(currencyId => {
		const res = find(allCurrencyList, { currencyId })
		if (res) {
			result = [...result, res]
		}
	})
	return result
}

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
