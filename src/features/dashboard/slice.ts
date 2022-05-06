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
	status: 'idle',
	dashBoardData: {},
}

const dashBoardSlice = createSlice({
	name: 'dashBoard',
	initialState,
	reducers: {
		onChangeDashBoardStatus: (state, action) => {
			state.status = action.payload
		},
	},
	extraReducers: builder =>
		builder
			.addCase(fetchDashBoardGetDataAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(fetchDashBoardGetDataAsync.rejected, state => {
				state.status = 'failed'
			})
			.addCase(fetchDashBoardGetDataAsync.fulfilled, (state, action) => {
				const dashBoardData = action.payload

				state.status = 'succeeded'
				state.dashBoardData = dashBoardData
			}),
})

export const selectDashboardStatus = (state: RootState) =>
	state.dashboard.status

export const selectDashboardData = (state: RootState) =>
	state.dashboard.dashBoardData

export const { onChangeDashBoardStatus } = dashBoardSlice.actions

export default dashBoardSlice.reducer
