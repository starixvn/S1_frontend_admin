import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { fetchDashBoardGetDataAsync } from './thunk'
import { DashBoardData } from './type'

interface DashBoardState {
	loading?: boolean
	data: DashBoardData
}

const initialState: DashBoardState = {
	loading: undefined,
	data: {},
}

const dashBoardSlice = createSlice({
	name: 'dashBoard',
	initialState,
	reducers: {},
	extraReducers: builder =>
		builder
			.addCase(fetchDashBoardGetDataAsync.pending, state => {
				state.loading = true
			})
			.addCase(fetchDashBoardGetDataAsync.fulfilled, (state, action) => {
				const dashBoardData = action.payload

				state.loading = false
				state.data = dashBoardData
			})
			.addCase(fetchDashBoardGetDataAsync.rejected, state => {
				state.loading = false
			}),
})

const selectDashboardLoading = (state: RootState) => state.dashboard.loading

const selectDashboardData = (state: RootState) => state.dashboard.data

export { selectDashboardLoading, selectDashboardData }

export default dashBoardSlice.reducer
