import { rootApi } from 'common/service/rootApi/api'

import {
	IGetListArgs,
	IDepositReferralReportResponse,
	IGetDetailByCustIdArgs,
	IExportDepositReferralReportArgs,
	IDetailByCustIdResponse,
} from 'features/newReferralReport/type'

export const newReferralReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositReferralReportList: builder.query<
			IDepositReferralReportResponse,
			IGetListArgs
		>({
			query: data => ({
				url: 'DepositReferralReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		getDetailByCustId: builder.query<
			IDetailByCustIdResponse,
			IGetDetailByCustIdArgs
		>({
			query: data => ({
				url: 'DepositReferralReport/GetDetailByCustId',
				method: 'POST',
				data,
			}),
		}),
		exportDepositReferralReport: builder.mutation<
			Blob,
			IExportDepositReferralReportArgs
		>({
			query: data => ({
				url: 'DepositReferralReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetDepositReferralReportListQuery,
	useLazyGetDetailByCustIdQuery,
	useExportDepositReferralReportMutation,
} = newReferralReportApi
