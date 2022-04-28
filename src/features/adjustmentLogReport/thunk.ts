import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchLogReportList } from './api'
import { FetchLogReportListInterface } from './type'

export const fetchLogReportListAsync = createAsyncThunk(
	'a/fetchLogReportList',

	async (body: FetchLogReportListInterface) => {
		const data = await fetchLogReportList(body)

		return data
	}
)
