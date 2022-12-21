import { rootApi } from 'common/service/rootApi/api'
import {
	IExportVerificationRewardReportArgs,
	IVerificationRewardReportArgs,
	IVerificationRewardReportResponse,
} from 'features/verificationReport/type'

export const verificationRewardReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getVerificationRewardReport: builder.query<
			IVerificationRewardReportResponse,
			IVerificationRewardReportArgs
		>({
			query: data => ({
				url: 'VerificationRewardReport/Get',
				method: 'POST',
				data,
			}),
		}),
		exportVerificationRewardReport: builder.mutation<
			Blob,
			IExportVerificationRewardReportArgs
		>({
			query: data => ({
				url: 'VerificationRewardReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetVerificationRewardReportQuery,
	useExportVerificationRewardReportMutation,
} = verificationRewardReportApi
