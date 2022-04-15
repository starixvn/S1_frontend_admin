import { createSlice } from '@reduxjs/toolkit'
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

export default dashBoardSlice.reducer
