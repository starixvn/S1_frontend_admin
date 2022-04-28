import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { RequestStatusType } from 'type'
import { fetchDashBoardGetDataAsync } from './thunk'
import { DashBoardData } from './type'

interface DashBoardState {
	status?: RequestStatusType
	dashBoardData: DashBoardData
}

const initialState: DashBoardState = {
	status: undefined,
	dashBoardData: {},
}

const dashBoardSlice = createSlice({
	name: 'dashBoard',
	initialState,
	reducers: {},
	extraReducers: builder =>
		builder
			.addCase(fetchDashBoardGetDataAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(fetchDashBoardGetDataAsync.fulfilled, (state, action) => {
				const dashBoardData = action.payload

				state.status = 'idle'
				state.dashBoardData = dashBoardData
			})
			.addCase(fetchDashBoardGetDataAsync.rejected, state => {
				state.status = 'idle'
			}),
})

export const selectDashboardStatus = (state: RootState) =>
	state.dashboard.status

export const selectDashboardData = (state: RootState) =>
	state.dashboard.dashBoardData

export default dashBoardSlice.reducer
