import { createAsyncThunk } from '@reduxjs/toolkit'
import { map } from 'lodash'
import {
	fetchActionTypeList,
	fetchAdjustmentInfoLogMenu,
	fetchAdminUserSiteList,
	fetchAllCurrencyList,
	fetchAdminUserCurrencyList,
} from './api'

export const fetchAllEnumAsync = createAsyncThunk(
	'enum/fetchAllEnum',
	async () => {
		const [
			userSiteList,
			allCurrencyList,
			adjustmentInfoLogMenu,
			actionTypeList,
			adminUserCurrencyList,
		] = await Promise.allSettled([
			fetchAdminUserSiteList(),
			fetchAllCurrencyList(),
			fetchAdjustmentInfoLogMenu(),
			fetchActionTypeList(),
			fetchAdminUserCurrencyList(),
		]).then(results =>
			map(results, result =>
				result.status === 'fulfilled' ? result.value : []
			)
		)

		return {
			userSiteList,
			allCurrencyList,
			adjustmentInfoLogMenu,
			actionTypeList,
			adminUserCurrencyList,
		}
	}
)
