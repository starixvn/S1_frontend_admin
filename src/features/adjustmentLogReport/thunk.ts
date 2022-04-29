import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchLogReportList } from './api'
import { FetchLogReportListProps } from './type'

export const fetchLogReportListAsync = createAsyncThunk(
	'a/fetchLogReportList',

	async (body: FetchLogReportListProps) => {
		const response = await fetchLogReportList(body)

		return response
	}
)
