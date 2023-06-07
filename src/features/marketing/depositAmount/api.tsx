import { rootApi } from 'common/service/rootApi/api'
import {
	IGetMarketingBaseArgs,
	IGetMarketingDepositSignUpUrlSummaryArgs,
	IGetMarketingDepositSignUpDetailArgs,
	IExportMarketingDepositArgs,
	IMarketingDepositSummaryResponse,
	IMarketingDepositSignUpUrlSummaryResponse,
	IMarketingDepositSignUpDetailResponse,
} from 'features/marketing/type'

const marketingDepositAmountApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMarketingDepositSummaryData: builder.query<
			IMarketingDepositSummaryResponse,
			IGetMarketingBaseArgs
		>({
			query: data => ({
				url: 'MpaMarketing/DepositSummary',
				method: 'POST',
				data,
			}),
		}),
		getMarketingDepositSignUpUrlSummaryData: builder.query<
			IMarketingDepositSignUpUrlSummaryResponse,
			IGetMarketingDepositSignUpUrlSummaryArgs
		>({
			query: data => ({
				url: 'MpaMarketing/DepositSignUpUrlSummary',
				method: 'POST',
				data,
			}),
		}),
		getMarketingDepositSignUpUrlDetailList: builder.query<
			IMarketingDepositSignUpDetailResponse,
			IGetMarketingDepositSignUpDetailArgs
		>({
			query: data => ({
				url: 'MpaMarketing/DepositSignUpDetail',
				method: 'POST',
				data,
			}),
		}),
		exportMarketingDepositReport: builder.mutation<
			Blob,
			IExportMarketingDepositArgs
		>({
			query: data => ({
				url: 'MpaMarketing/DepositExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetMarketingDepositSummaryDataQuery,
	useGetMarketingDepositSignUpUrlSummaryDataQuery,
	useLazyGetMarketingDepositSignUpUrlDetailListQuery,
	useExportMarketingDepositReportMutation,
} = marketingDepositAmountApi
