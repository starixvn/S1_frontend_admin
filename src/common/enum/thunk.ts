import { createAsyncThunk } from '@reduxjs/toolkit'
import { map } from 'lodash'
import {
	fetchActionTypeList,
	fetchAdjustmentInfoLogMenu,
	fetchAdminUserSiteList,
	fetchAllCurrencyList,
} from './api'

export const fetchAllEnumAsync = createAsyncThunk(
	'enum/fetchAllEnum',
	async () => {
		const [
			userSiteList,
			allCurrencyList,
			adjustmentInfoLogMenu,
			actionTypeList,
		] = await Promise.allSettled([
			fetchAdminUserSiteList(),
			fetchAllCurrencyList(),
			fetchAdjustmentInfoLogMenu(),
			fetchActionTypeList(),
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
		}
	}
)
