import { rootApi } from 'common/service/rootApi/api'
import {
	IGetBonusAmountClaimedArgs,
	IGetBonusAmountClaimedDetailArgs,
	IExportBonusAmountClaimedArgs,
	IBonusAmountClaimedReportResponse,
	IBonusAmountClaimedDetailResponse,
} from 'features/marketing/type'

const marketingBonusAmountClaimedApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMarketingBonusAmountClaimedData: builder.query<
			IBonusAmountClaimedReportResponse,
			IGetBonusAmountClaimedArgs
		>({
			query: data => ({
				url: 'MpaBonusInfoReport/GetMpaMarketingBonus',
				method: 'POST',
				data,
			}),
		}),
		getMarketingBonusAmountClaimedDetailList: builder.query<
			IBonusAmountClaimedDetailResponse,
			IGetBonusAmountClaimedDetailArgs
		>({
			query: data => ({
				url: 'MpaBonusInfoReport/GetMpaMarketingBonusDetail',
				method: 'POST',
				data,
			}),
		}),
		exportMarketingBonusAmountClaimedReport: builder.mutation<
			Blob,
			IExportBonusAmountClaimedArgs
		>({
			query: data => ({
				url: 'MpaBonusInfoReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetMarketingBonusAmountClaimedDataQuery,
	useLazyGetMarketingBonusAmountClaimedDetailListQuery,
	useExportMarketingBonusAmountClaimedReportMutation,
} = marketingBonusAmountClaimedApi
