import { rootApi } from 'common/service/rootApi/api'
import {
	IGetWithdrawalTypeData,
	IGetWithdrawalReportArgs,
	IGetWithdrawalReportData,
	IGetWithdrawalReportExportArgs,
} from 'features/withdrawalPaymentReport/type'

import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const bankFinancialReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getWithdrawalPaymentReportType: builder.query<
			IAxiosResponse<IGetWithdrawalTypeData[]>,
			null
		>({
			query: data => ({
				url: 'PaymentReport/GetWithdrawalType',
				method: 'POST',
				data,
			}),
		}),
		getWithdrawalPaymentReport: builder.query<
			IAxiosResponse<IGetWithdrawalReportData>,
			IGetWithdrawalReportArgs
		>({
			query: data => ({
				url: 'PaymentReport/GetWithdrawalReport',
				method: 'POST',
				data,
			}),
		}),
		exportWithdrawalPaymentReport: builder.mutation<
			Blob,
			IGetWithdrawalReportExportArgs
		>({
			query: data => ({
				url: 'PaymentReport/ExportWithdrawalReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetWithdrawalPaymentReportTypeQuery,
	useLazyGetWithdrawalPaymentReportQuery,
	useExportWithdrawalPaymentReportMutation,
} = bankFinancialReportApi
