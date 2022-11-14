import { rootApi } from 'common/service/rootApi/api'
import {
	IBonusReportResponse,
	IExportBonusReportArgs,
	IGetBonusReportDataListArgs,
	IPromotionCategoryOptionsResponse,
} from './type'

export const bonusReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPromotionCategoryOptions: builder.query<
			IPromotionCategoryOptionsResponse,
			null
		>({
			query: () => ({
				url: 'BonusReport/PromotionCategoryOption',
				method: 'POST',
			}),
		}),
		getBonusReportDataList: builder.query<
			IBonusReportResponse,
			IGetBonusReportDataListArgs
		>({
			query: data => ({
				url: 'BonusReport/GetDataList',
				method: 'POST',
				data,
			}),
		}),
		exportBonusReport: builder.mutation<Blob, IExportBonusReportArgs>({
			query: data => ({
				url: 'BonusReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetPromotionCategoryOptionsQuery,
	useLazyGetBonusReportDataListQuery,
	useExportBonusReportMutation,
} = bonusReportApi
