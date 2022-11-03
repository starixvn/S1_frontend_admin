import { rootApi } from 'common/service/rootApi/api'
import {
	IExportForVipArgs,
	IGetListForVipArgs,
	IGetListForVipResponse,
	IGetVipRebateDetailArgs,
	IGetVipRebateDetailResponse,
} from 'features/vipRebateReport/type'

export const vipRebateReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getListForVip: builder.query<IGetListForVipResponse, IGetListForVipArgs>({
			query: data => ({
				url: 'RebateReport/GetListForVip',
				method: 'POST',
				data,
			}),
		}),
		exportForVip: builder.mutation<Blob, IExportForVipArgs>({
			query: data => ({
				url: 'RebateReport/ExportForVip',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		GetVipRebateDetail: builder.query<
			IGetVipRebateDetailResponse,
			IGetVipRebateDetailArgs
		>({
			query: data => ({
				url: 'RebateReport/GetVipRebateDetail',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetListForVipQuery,
	useExportForVipMutation,
	useLazyGetVipRebateDetailQuery,
} = vipRebateReportApi
