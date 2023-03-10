import { createAsyncThunk } from '@reduxjs/toolkit'
import { map } from 'lodash'

import {
	fetchActionTypeList,
	fetchAdjustmentInfoLogMenu,
	fetchAdminUserSiteList,
	fetchAllCurrencyList,
	fetchAdminUserCurrency,
} from './api'
import {
	ActionType,
	AdjustmentInfoLogMenuItem,
	Currency,
	IAdminUserCurrency,
	UserSite,
} from './type'

export interface IAllEnumState {
	userSiteList: UserSite[]
	allCurrencyList: Currency[]
	adjustmentInfoLogMenu: AdjustmentInfoLogMenuItem[]
	actionTypeList: ActionType[]
	siteCurrencyList: number[]
	rewardsCurrencyList: number[]
	vipCurrencyList: number[]
	allSiteEnableCurrencyList: number[]
}

export const fetchAllEnumAsync = createAsyncThunk(
	'enum/fetchAllEnum',
	async () => {
		const [
			userSiteList,
			allCurrencyList,
			adjustmentInfoLogMenu,
			actionTypeList,
			adminUserCurrency,
		] = await Promise.allSettled([
			fetchAdminUserSiteList(),
			fetchAllCurrencyList(),
			fetchAdjustmentInfoLogMenu(),
			fetchActionTypeList(),
			fetchAdminUserCurrency(),
		]).then(results =>
			map(results, result =>
				result.status === 'fulfilled' ? result.value : []
			)
		)

		const {
			siteCurrencyList = [],
			rewardsCurrencyList = [],
			vipCurrencyList = [],
			allSiteEnableCurrencyList = [],
		} = (adminUserCurrency as IAdminUserCurrency) ?? {}

		return {
			userSiteList,
			allCurrencyList,
			adjustmentInfoLogMenu,
			actionTypeList,
			siteCurrencyList,
			rewardsCurrencyList,
			vipCurrencyList,
			allSiteEnableCurrencyList,
		}
	}
)
