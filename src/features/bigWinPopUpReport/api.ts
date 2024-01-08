import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IBigWinReportData,
	IExportBigWinReportArgs,
	IGetBigWinReportArgs,
} from 'features/bigWinPopUpReport/type'

export const bigWinPopUpReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBigWinReport: builder.query<
			IAxiosResponse<IBigWinReportData[]>,
			IGetBigWinReportArgs
		>({
			query: data => ({
				url: 'BigWin/GetBigWinReport',
				method: 'POST',
				data,
			}),
		}),
		exportBigWinReport: builder.mutation<Blob, IExportBigWinReportArgs>({
			query: data => ({
				url: 'BigWin/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const { useLazyGetBigWinReportQuery, useExportBigWinReportMutation } =
	bigWinPopUpReportApi
