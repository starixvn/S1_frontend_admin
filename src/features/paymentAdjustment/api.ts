import { rootApi } from 'common/service/rootApi/api'
import {
	IExportPaymentAdjustmentReportArgs,
	IGetPaymentAdjustmentReportArgs,
	IGetPaymentAdjustmentReportResponse,
	ISetAdjustmentArgs,
} from 'features/paymentAdjustment/type'

export const paymentAdjustmentApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		exportPaymentAdjustmentReport: builder.mutation<
			Blob,
			IExportPaymentAdjustmentReportArgs
		>({
			query: data => ({
				url: 'AdjustmentReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getPaymentAdjustmentReport: builder.query<
			IGetPaymentAdjustmentReportResponse,
			IGetPaymentAdjustmentReportArgs
		>({
			query: data => ({
				url: 'AdjustmentReport/GetDataList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setPaymentAdjustment: builder.mutation<void, ISetAdjustmentArgs>({
			query: data => ({
				url: 'AdjustmentReport/SetAdjustment',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetPaymentAdjustmentReportQuery,
	useExportPaymentAdjustmentReportMutation,
	useSetPaymentAdjustmentMutation,
} = paymentAdjustmentApi
