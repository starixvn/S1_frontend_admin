import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IExportRedemptionListArgs,
	IGetRedemptionDetailArg,
	IGetRedemptionDetailResponse,
	IGetRedemptionListArgs,
	IGetRedemptionListResponse,
	IGetRedemptionLogArgs,
	IGetRedemptionLogResponse,
	ISetRedemptionInfoArgs,
} from './type'

export const redemptionListingApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getRedemptionList: builder.query<
			IGetRedemptionListResponse,
			IGetRedemptionListArgs
		>({
			query: data => ({
				url: 'Redemption/GetRedemptionList',
				method: 'POST',
				data,
			}),
		}),
		exportRedemptionList: builder.mutation<Blob, IExportRedemptionListArgs>({
			query: data => ({
				url: 'Redemption/ExportRedemptionList',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getRedemptionDetail: builder.query<
			IGetRedemptionDetailResponse,
			IGetRedemptionDetailArg
		>({
			query: data => ({
				url: 'Redemption/GetRedemptionDetail',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getRedemptionLog: builder.query<
			IGetRedemptionLogResponse,
			IGetRedemptionLogArgs
		>({
			query: data => ({
				url: 'Redemption/GetRedemptionLog',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setRedemptionInfo: builder.mutation<
			IAxiosResponse<void>,
			ISetRedemptionInfoArgs
		>({
			query: data => ({
				url: 'Redemption/SetRedemptionInfo',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		uploadReceipt: builder.mutation<
			IAxiosResponse<{ receiptUrls: string[] }>,
			FormData
		>({
			query: data => ({
				url: 'Redemption/UploadReceipt',
				method: 'POST',
				data,
				headers: {
					'content-type':
						'multipart/form-data; boundary=<calculated when request is sent>',
				},
			}),
		}),
	}),
})

export const {
	useLazyGetRedemptionListQuery,
	useLazyGetRedemptionDetailQuery,
	useLazyGetRedemptionLogQuery,
	useExportRedemptionListMutation,
	useSetRedemptionInfoMutation,
	useUploadReceiptMutation,
} = redemptionListingApi
