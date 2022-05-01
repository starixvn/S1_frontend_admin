import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { RequestStatusType } from 'type'
import { fetchLogReportListAsync } from './thunk'
import { LogReportInterface } from './type'

interface AdjustmentLogReportState {
	status: RequestStatusType
	adjustmentLogReportList: LogReportInterface[]
	paginationTotal: number
}

const initialState: AdjustmentLogReportState = {
	status: 'idle',
	adjustmentLogReportList: [],
	paginationTotal: 0,
}

const adjustmentLogReportSlice = createSlice({
	name: 'adjustmentLogReport',
	initialState,
	reducers: {
		setAdjustmentLogReportStatus: (state, action) => {
			state.status = action.payload
		},
	},
	extraReducers: build =>
		build
			.addCase(fetchLogReportListAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(fetchLogReportListAsync.rejected, state => {
				state.adjustmentLogReportList = []
				state.status = 'failed'
			})
			.addCase(fetchLogReportListAsync.fulfilled, (state, action) => {
				const { data, rowCount } = action.payload

				state.adjustmentLogReportList = data
				state.paginationTotal = rowCount
				state.status = 'succeeded'
			}),
})
export const { setAdjustmentLogReportStatus } = adjustmentLogReportSlice.actions

export const selectAdjustmentLogReportStatus = (state: RootState) =>
	state.adjustmentLogReport.status

export const selectAdjustmentLogReportList = (state: RootState) =>
	state.adjustmentLogReport.adjustmentLogReportList

const adjustmentLogReportReducer = adjustmentLogReportSlice.reducer

export default adjustmentLogReportReducer
