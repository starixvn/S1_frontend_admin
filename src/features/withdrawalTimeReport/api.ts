import { rootApi } from 'common/service/rootApi/api'
import {
	IGetWithdrawalTimeReportListArgs,
	IWithdrawalTimeReportListResponse,
	IExportWithdrawalTimeReportArgs,
} from 'features/withdrawalTimeReport/type'

export const withdrawalTimeReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getWithdrawalTimeReportList: builder.query<
			IWithdrawalTimeReportListResponse,
			IGetWithdrawalTimeReportListArgs
		>({
			query: data => ({
				url: 'WithdrawalTimeReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportWithdrawalTimeReport: builder.mutation<
			Blob,
			IExportWithdrawalTimeReportArgs
		>({
			query: data => ({
				url: 'WithdrawalTimeReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetWithdrawalTimeReportListQuery,
	useExportWithdrawalTimeReportMutation,
} = withdrawalTimeReportApi
