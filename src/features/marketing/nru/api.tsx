import { rootApi } from 'common/service/rootApi/api'
import {
	IGetMarketingNruReportArgs,
	IGetMarketingNruBonusReportArgs,
	IGetMarketingNruBonusDetailReportArgs,
	IExportMarketingNruReportArgs,
	IMarketingNruReportResponse,
	IMarketingNruBonusReportResponse,
	IMarketingNruBonusDetailReportResponse,
} from 'features/marketing/type'

const marketingNruApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMarketingNruReport: builder.query<
			IMarketingNruReportResponse,
			IGetMarketingNruReportArgs
		>({
			query: data => ({
				url: 'MpaNRUReport/GetMpaNRUReport',
				method: 'POST',
				data,
			}),
		}),
		getMarketingNruBonusReport: builder.query<
			IMarketingNruBonusReportResponse,
			IGetMarketingNruBonusReportArgs
		>({
			query: data => ({
				url: 'MpaNRUReport/GetMpaNRUBonusReport',
				method: 'POST',
				data,
			}),
		}),
		getMarketingNruBonusDetailReport: builder.query<
			IMarketingNruBonusDetailReportResponse,
			IGetMarketingNruBonusDetailReportArgs
		>({
			query: data => ({
				url: 'MpaNRUReport/GetMpaNRUBonusDetailReport',
				method: 'POST',
				data,
			}),
		}),
		exportMarketingNruReport: builder.mutation<
			Blob,
			IExportMarketingNruReportArgs
		>({
			query: data => ({
				url: 'MpaNRUReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetMarketingNruReportQuery,
	useGetMarketingNruBonusReportQuery,
	useLazyGetMarketingNruBonusDetailReportQuery,
	useExportMarketingNruReportMutation,
} = marketingNruApi
