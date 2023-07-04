import { rootApi } from 'common/service/rootApi/api'

import {
	IGetListArgs,
	IDepositReferralReportResponse,
	IGetDetailByCustIdArgs,
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
	}),
})

export const {
	useLazyGetDepositReferralReportListQuery,
	useLazyGetDetailByCustIdQuery,
} = newReferralReportApi
