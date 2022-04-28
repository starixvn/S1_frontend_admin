import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { fetchLogReportListAsync } from './thunk'

interface AdjustmentLogReportState {
	AdjustmentLogReportList: any[]
}

const initialState: AdjustmentLogReportState = {
	AdjustmentLogReportList: [],
}

const adjustmentLogReportSlice = createSlice({
	name: 'adjustmentLogReport',
	initialState,
	reducers: {},
	extraReducers: build =>
		build.addCase(fetchLogReportListAsync.fulfilled, (state, action) => {
			state.AdjustmentLogReportList = action.payload
		}),
})

export const selectAdjustmentLogReportList = (state: RootState) =>
	state.adjustmentLogReport.AdjustmentLogReportList

const adjustmentLogReportReducer = adjustmentLogReportSlice.reducer

export default adjustmentLogReportReducer
