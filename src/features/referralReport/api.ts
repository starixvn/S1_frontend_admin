import { rootApi } from 'common/service/rootApi/api'
import {
	IGetReferralReportResponse,
	IReferralReportArgs,
	IReferralCustReportResponse,
	IReferralCustReportArgs,
	IExportReferralReportArgs,
} from './type'

export const referralReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getReferralReport: builder.query<
			IGetReferralReportResponse,
			IReferralReportArgs
		>({
			query: data => ({
				url: 'ReferralReport/GetList',
				method: 'POST',
				data,
			}),
		}),

		getCustReferralReport: builder.query<
			IReferralCustReportResponse,
			IReferralCustReportArgs
		>({
			query: data => ({
				url: 'ReferralReport/GetByCustId',
				method: 'POST',
				data,
			}),
		}),

		exportReferralReportFile: builder.mutation<Blob, IExportReferralReportArgs>(
			{
				query: data => ({
					url: 'ReferralReport/Export',
					method: 'POST',
					data,
					responseType: 'blob',
				}),
			}
		),
	}),
})
export const {
	useLazyGetReferralReportQuery,
	useLazyGetCustReferralReportQuery,
	useExportReferralReportFileMutation,
} = referralReportApi
