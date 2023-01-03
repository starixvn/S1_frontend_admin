import { rootApi } from 'common/service/rootApi/api'
import {
	IGetDepositTypeData,
	IGetDepositReportArgs,
	IGetDepositReportData,
	IGetDepositReportExportArgs,
} from 'features/depositPaymentReport/type'

import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const bankFinancialReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositPaymentReportType: builder.query<
			IAxiosResponse<IGetDepositTypeData[]>,
			null
		>({
			query: data => ({
				url: 'PaymentReport/GetDepositType',
				method: 'POST',
				data,
			}),
		}),
		getDepositPaymentReport: builder.query<
			IAxiosResponse<IGetDepositReportData>,
			IGetDepositReportArgs
		>({
			query: data => ({
				url: 'PaymentReport/GetDepositReport',
				method: 'POST',
				data,
			}),
		}),
		exportDepositPaymentReport: builder.mutation<
			Blob,
			IGetDepositReportExportArgs
		>({
			query: data => ({
				url: 'PaymentReport/ExportDepositReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useGetDepositPaymentReportTypeQuery,
	useLazyGetDepositPaymentReportQuery,
	useExportDepositPaymentReportMutation,
} = bankFinancialReportApi
