import { createAsyncThunk } from '@reduxjs/toolkit'
import _ from 'lodash'
import { fetchAdminUserSiteList, fetchAllCurrencyList } from './api'

export const fetchAllEnumAsync = createAsyncThunk(
	'enum/fetchAllEnum',
	async () => {
		const [userSiteList, allCurrencyList] = await Promise.allSettled([
			fetchAdminUserSiteList(),
			fetchAllCurrencyList(),
		]).then(results =>
			_.map(results, result =>
				result.status === 'fulfilled' ? result.value : []
			)
		)

		return { userSiteList, allCurrencyList }
	}
)
