import { rootApi } from 'common/service/rootApi/api'
import type {
	IGetPredictionChallengeReportArgs,
	IPredictionChallengeReportResponse,
	IGetPredictionChallengeReportExportArgs,
	IClaimPredictPromotionArgs,
} from './type'
import { IAxiosResponse } from '../../common/service/axiosBaseQuery'

export const predictChallengeReport = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPredictionChallengeReport: builder.query<
			IPredictionChallengeReportResponse,
			IGetPredictionChallengeReportArgs
		>({
			query: data => ({
				url: 'PredictionChallengeReport/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		claimPredictPromotion: builder.mutation<
			IAxiosResponse<void>,
			IClaimPredictPromotionArgs
		>({
			query: data => ({
				url: 'PredictionChallengeReport/ClaimPredictPromotion',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		exportPredictionChallengeReport: builder.mutation<
			Blob,
			IGetPredictionChallengeReportExportArgs
		>({
			query: data => ({
				url: 'PredictionChallengeReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetPredictionChallengeReportQuery,
	useClaimPredictPromotionMutation,
	useExportPredictionChallengeReportMutation,
} = predictChallengeReport
