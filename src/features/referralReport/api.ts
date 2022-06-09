import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetReferralReportResponse,
	IReferralReportArgs,
	IReferralCustReportResponse,
	IReferralCustReportArgs,
	IExportReferralReportArgs,
} from './type'

export const referralReportApi = createApi({
	reducerPath: 'referralReportApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getReferralReport: builder.query<
			IGetReferralReportResponse,
			IReferralReportArgs
		>({
			query: data => ({
				url: 'ReferralReport/GetList',
				method: 'POST',
				data,
			}),
		}),

		getCustReferralReport: builder.query<
			IReferralCustReportResponse,
			IReferralCustReportArgs
		>({
			query: data => ({
				url: 'ReferralReport/GetByCustId',
				method: 'POST',
				data,
			}),
		}),

		exportReferralReportFile: builder.mutation<Blob, IExportReferralReportArgs>(
			{
				query: data => ({
					url: 'ReferralReport/Export',
					method: 'POST',
					data,
					responseType: 'blob',
				}),
			}
		),
	}),
})
export const {
	useLazyGetReferralReportQuery,
	useLazyGetCustReferralReportQuery,
	useExportReferralReportFileMutation,
} = referralReportApi
