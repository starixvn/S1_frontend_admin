import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { RequestStatusType } from 'type'
import { fetchLogReportListAsync } from './thunk'

interface AdjustmentLogReportState {
	status: RequestStatusType
	AdjustmentLogReportList: any[]
}

const initialState: AdjustmentLogReportState = {
	status: 'idle',
	AdjustmentLogReportList: [],
}

const adjustmentLogReportSlice = createSlice({
	name: 'adjustmentLogReport',
	initialState,
	reducers: {},
	extraReducers: build =>
		build
			.addCase(fetchLogReportListAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(fetchLogReportListAsync.rejected, state => {
				state.status = 'failed'
			})
			.addCase(fetchLogReportListAsync.fulfilled, (state, action) => {
				state.AdjustmentLogReportList = action.payload
				state.status = 'succeeded'
			}),
})

export const selectAdjustmentLogReportStatus = (state: RootState) =>
	state.adjustmentLogReport.status

export const selectAdjustmentLogReportList = (state: RootState) =>
	state.adjustmentLogReport.AdjustmentLogReportList

const adjustmentLogReportReducer = adjustmentLogReportSlice.reducer

export default adjustmentLogReportReducer
