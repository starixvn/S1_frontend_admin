import { rootApi } from 'common/service/rootApi/api'
import type {
	IExportStickerReportArgs,
	IGetStickerReportArgs,
	TStickerReportResponse,
} from './type'

export const stickerReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getStickerReport: builder.query<
			TStickerReportResponse,
			IGetStickerReportArgs
		>({
			query: data => ({
				url: 'LotteryEvent/GetStickerReport',
				method: 'POST',
				data,
			}),
		}),
		exportStickerReportExport: builder.mutation<Blob, IExportStickerReportArgs>(
			{
				query: data => ({
					url: 'LotteryEvent/GetStickerReportExport',
					method: 'POST',
					data,
					responseType: 'blob',
				}),
			}
		),
	}),
})

export const {
	useLazyGetStickerReportQuery,
	useExportStickerReportExportMutation,
} = stickerReportApi
