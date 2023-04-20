import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IDepositOperatorData,
	IGetDepositOperatorListArgs,
	IBatchRejectedDepositTransIdsArgs,
	IExportDepositArgs,
	IDepositCommentData,
	ISetDepositStatusArgs,
	ISetAmountByTransIdArgs,
	IDepositOperatorResponse,
	IDepositReasonMessage,
	ISendDepositReasonMessageArgs,
	ICheckDepositReceiptArgs,
	IDeleteReceiptArgs,
	IDepositReceiptByTransIdResponse,
	IUploadReceiptArgs,
} from 'features/depositOperator/type'

export const depositOperatorApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositOperatorList: builder.query<
			IDepositOperatorResponse,
			IGetDepositOperatorListArgs
		>({
			query: data => ({
				url: 'Deposit/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		batchRejectedDepositTransIds: builder.mutation<
			IAxiosResponse<null>,
			IBatchRejectedDepositTransIdsArgs
		>({
			query: data => ({
				url: 'Deposit/BatchRejected',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		exportDeposit: builder.mutation<Blob, IExportDepositArgs>({
			query: data => ({
				url: 'Deposit/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getDepositInfoByTransId: builder.query<
			IAxiosResponse<IDepositOperatorData>,
			{ transId: string | undefined }
		>({
			query: data => ({
				url: 'Deposit/GetByTransId',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 取得存款收據圖片
		getDepositReceiptByTransId: builder.query<
			IDepositReceiptByTransIdResponse,
			{ transId: string | undefined }
		>({
			query: ({ transId }) => ({
				url: `Deposit/GetReceiptByTransId?transId=${transId}`,
				method: 'GET',
			}),
			providesTags: ['POST'],
		}),
		getDepositCommentsByTransId: builder.query<
			IAxiosResponse<IDepositCommentData[]>,
			{ transId: string | undefined }
		>({
			query: data => ({
				url: 'Deposit/GetCommentByTransId',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 更改存款單狀態
		setDepositStatus: builder.mutation<
			IAxiosResponse<null>,
			ISetDepositStatusArgs
		>({
			query: data => ({
				url: 'Deposit/SendToNext',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 更新指定存款金額
		setAmountByTransId: builder.mutation<
			IAxiosResponse<null>,
			ISetAmountByTransIdArgs
		>({
			query: data => ({
				url: 'Deposit/SetAmountByTransId',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),

		setDepositManualApproval: builder.mutation<
			IAxiosResponse<null>,
			{ transId: string }
		>({
			query: data => ({
				url: 'Deposit/DepositManualApproval',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getDepositReasonMessages: builder.query<
			IAxiosResponse<IDepositReasonMessage[]>,
			null
		>({
			query: data => ({
				url: 'Deposit/DepositMessageStatusList',
				method: 'POST',
				data,
			}),
		}),
		setDepositReasonMessage: builder.mutation<
			IAxiosResponse<null>,
			ISendDepositReasonMessageArgs
		>({
			query: data => ({
				url: 'Deposit/SetDepositMessage',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		checkDepositReceipt: builder.mutation<
			IAxiosResponse<null>,
			ICheckDepositReceiptArgs
		>({
			query: data => ({
				url: 'Deposit/CheckDepositReceipt',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteReceipt: builder.mutation<IAxiosResponse<null>, IDeleteReceiptArgs>({
			query: data => ({
				url: 'Deposit/DeleteReceipt',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		uploadReceipt: builder.mutation<IAxiosResponse<null>, IUploadReceiptArgs>({
			query: data => ({
				url: 'Deposit/UploadReceipt',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetDepositOperatorListQuery,
	useBatchRejectedDepositTransIdsMutation,
	useExportDepositMutation,
	useGetDepositInfoByTransIdQuery,
	useGetDepositReceiptByTransIdQuery,
	useGetDepositCommentsByTransIdQuery,
	useSetDepositStatusMutation,
	useSetAmountByTransIdMutation,
	useSetDepositManualApprovalMutation,
	useGetDepositReasonMessagesQuery,
	useSetDepositReasonMessageMutation,
	useCheckDepositReceiptMutation,
	useDeleteReceiptMutation,
	useUploadReceiptMutation,
} = depositOperatorApi
