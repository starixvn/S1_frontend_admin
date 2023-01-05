import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetFailRecordListArgs,
	IExportFailBetRecordArgs,
	IFailRecordReportData,
} from 'features/failBet/type'

export const failBetApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getFailRecordReport: builder.query<
			IAxiosResponse<IFailRecordReportData[]>,
			IGetFailRecordListArgs
		>({
			query: data => ({
				url: 'TpFailRecordReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportFailRecordReport: builder.mutation<Blob, IExportFailBetRecordArgs>({
			query: data => ({
				url: 'TpFailRecordReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetFailRecordReportQuery,
	useExportFailRecordReportMutation,
} = failBetApi
