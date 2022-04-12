import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDashBoardGetData } from './api'

interface FetchDashBoardGetDataAsyncInterface {
	siteId?: number
	currencyId?: number
	baseCurrencyId?: number
}
export const fetchDashBoardGetDataAsync = createAsyncThunk(
	'dashboard/fetchDashBoardGetData',
	async ({
		siteId,
		currencyId,
		baseCurrencyId,
	}: FetchDashBoardGetDataAsyncInterface) => {
		const dashBoardData = await fetchDashBoardGetData({
			siteId,
			currencyId,
			baseCurrencyId,
		})

		return dashBoardData
	}
)
