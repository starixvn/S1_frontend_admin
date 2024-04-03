import { rootApi } from 'common/service/rootApi/api'
import { IGetLogReportListArgs, IGetLogReportListResponse } from './type'

export const adjustmentLogReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getLogReportList: builder.query<
			IGetLogReportListResponse,
			IGetLogReportListArgs
		>({
			query: data => ({
				url: 'SettingLogReport/GetList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useLazyGetLogReportListQuery } = adjustmentLogReportApi
