import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IExportPaymentAdjustmentReportArgs,
	IGetPaymentAdjustmentReportArgs,
	IGetPaymentAdjustmentReportResponse,
	IGetReasonListData,
	ISetAdjustmentArgs,
} from 'features/paymentAdjustment/type'

export const paymentAdjustmentApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPaymentReasonList: builder.query<
			IAxiosResponse<IGetReasonListData[]>,
			null
		>({
			query: () => ({
				url: 'BalanceAdjustment/GetReasonList',
				method: 'POST',
			}),
		}),
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
	useGetPaymentReasonListQuery,
	useExportPaymentAdjustmentReportMutation,
	useSetPaymentAdjustmentMutation,
} = paymentAdjustmentApi
