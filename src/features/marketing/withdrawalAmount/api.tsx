import { rootApi } from 'common/service/rootApi/api'
import {
	IGetMarketingBaseArgs,
	IGetMarketingWithdrawalDetailArgs,
	IExportMarketingWithdrawalArgs,
	IMartingWithdrawalSummaryResponse,
	IMarketingWithdrawalDetailResponse,
} from 'features/marketing/type'

const marketingWithdrawalAmountApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMarketingWithdrawalSummary: builder.query<
			IMartingWithdrawalSummaryResponse,
			IGetMarketingBaseArgs
		>({
			query: data => ({
				url: 'MpaMarketing/WithdrawalSummary',
				method: 'POST',
				data,
			}),
		}),
		getMarketingWithdrawalDetail: builder.query<
			IMarketingWithdrawalDetailResponse,
			IGetMarketingWithdrawalDetailArgs
		>({
			query: data => ({
				url: 'MpaMarketing/WithdrawalDetails',
				method: 'POST',
				data,
			}),
		}),
		exportMarketingWithdrawalReport: builder.mutation<
			Blob,
			IExportMarketingWithdrawalArgs
		>({
			query: data => ({
				url: 'MpaMarketing/WithdrawalExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetMarketingWithdrawalSummaryQuery,
	useLazyGetMarketingWithdrawalDetailQuery,
	useExportMarketingWithdrawalReportMutation,
} = marketingWithdrawalAmountApi
