import { rootApi } from 'common/service/rootApi/api'
import {
	IBonusDetailListData,
	IBonusInfoData,
	IExportBonusDetailListArgs,
	IExportBonusInfoArgs,
	IGetBonusDetailListArgs,
	IGetBonusInfoArgs,
} from 'features/bonusInfo/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

const bonusInfoApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBonusInfo: builder.query<
			IAxiosResponse<IBonusInfoData[]>,
			IGetBonusInfoArgs
		>({
			query: data => ({
				url: 'MpaBonusInfoReport/GetInfoData',
				method: 'POST',
				data,
			}),
		}),
		// 用來拿 summary 的 api
		getInfoSummary: builder.query<IBonusInfoData, IGetBonusInfoArgs>({
			query: data => ({
				url: 'MpaBonusInfoReport/GetInfoDataSummary',
				method: 'POST',
				data,
			}),
		}),
		exportBonusInfo: builder.mutation<Blob, IExportBonusInfoArgs>({
			query: data => ({
				url: 'MpaBonusInfoReport/ExportInfoData',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getBonusDetail: builder.query<
			IAxiosResponse<IBonusDetailListData[]>,
			IGetBonusDetailListArgs
		>({
			query: data => ({
				url: 'MpaBonusInfoReport/GetDetailData',
				method: 'POST',
				data,
			}),
		}),
		exportBonusDetail: builder.mutation<Blob, IExportBonusDetailListArgs>({
			query: data => ({
				url: 'MpaBonusInfoReport/ExportDetailData',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetBonusInfoQuery,
	useLazyGetInfoSummaryQuery,
	useExportBonusInfoMutation,
	useLazyGetBonusDetailQuery,
	useExportBonusDetailMutation,
} = bonusInfoApi
