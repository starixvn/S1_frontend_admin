import { rootApi } from 'common/service/rootApi/api'
import {
	IExportDrawPrizeReportArgs,
	IGetDrawPrizeReportArgs,
	IGetDrawPrizeReportData,
	IGetDrawPrizeReportLogArgs,
	IGetDrawPrizeReportLogData,
} from 'features/drawPrizeReport/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const drawPrizeReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDrawPrizeReport: builder.query<
			IAxiosResponse<IGetDrawPrizeReportData>,
			IGetDrawPrizeReportArgs
		>({
			query: data => ({
				url: 'DrawPrizeReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportDrawPrizeReport: builder.mutation<Blob, IExportDrawPrizeReportArgs>({
			query: data => ({
				url: 'DrawPrizeReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getDrawPrizeLog: builder.query<
			IAxiosResponse<IGetDrawPrizeReportLogData[]>,
			IGetDrawPrizeReportLogArgs
		>({
			query: data => ({
				url: 'DrawPrizeReport/GetLog',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetDrawPrizeReportQuery,
	useExportDrawPrizeReportMutation,
	useLazyGetDrawPrizeLogQuery,
} = drawPrizeReportApi
