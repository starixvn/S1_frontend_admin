import { rootApi } from 'common/service/rootApi/api'
import {
	IGetDepositTimeReportArgs,
	IDepositTimeReportResponse,
	IExportDepositTimeReportArgs,
} from 'features/depositTimeReport/type'

export const depositTimeReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositTimeReportList: builder.query<
			IDepositTimeReportResponse,
			IGetDepositTimeReportArgs
		>({
			query: data => ({
				url: 'DepositTimeReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportDepositTimeReport: builder.mutation<
			Blob,
			IExportDepositTimeReportArgs
		>({
			query: data => ({
				url: 'DepositTimeReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetDepositTimeReportListQuery,
	useExportDepositTimeReportMutation,
} = depositTimeReportApi
