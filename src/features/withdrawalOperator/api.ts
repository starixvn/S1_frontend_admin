import { rootApi } from 'common/service/rootApi/api'
import {
	IAdjustmentWithdrawalData,
	ICustomerAssociateBankUserData,
	IDeletePictureArgs,
	IExportWithdrawalListArgs,
	IGetAdjustmentLogArgs,
	IGetByTransIdArgs,
	IGetCustomerAssociateBankUserArgs,
	IGetWithdrawalData,
	IGetWithdrawalListArgs,
	IGetWithdrawalResponse,
	IManualOperatorArgs,
	IReceiveArgs,
	ISendWithdrawalMessageArgs,
	ISetWithdrawalStatusArgs,
	IUploadPictureArgs,
	IWithdrawalCommentData,
	IWithdrawalReasonMessage,
} from 'features/withdrawalOperator/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const withdrawalOperatorApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getWithdrawalList: builder.query<
			IGetWithdrawalResponse,
			IGetWithdrawalListArgs
		>({
			query: data => ({
				url: 'Withdrawal/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		exportWithdrawalList: builder.mutation<Blob, IExportWithdrawalListArgs>({
			query: data => ({
				url: 'Withdrawal/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWithdrawalByTransId: builder.query<
			IAxiosResponse<IGetWithdrawalData>,
			IGetByTransIdArgs
		>({
			query: data => ({
				url: 'Withdrawal/GetByTransId',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getWithdrawalComment: builder.query<
			IAxiosResponse<IWithdrawalCommentData[]>,
			IGetByTransIdArgs
		>({
			query: data => ({
				url: 'Withdrawal/GetCommentByTransId',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// 更新狀態
		setWithdrawalStatus: builder.mutation<
			IAxiosResponse<null>,
			ISetWithdrawalStatusArgs
		>({
			query: data => ({
				url: 'Withdrawal/SendToNext',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// 手動強制更新
		manualApproval: builder.mutation<IAxiosResponse<null>, IManualOperatorArgs>(
			{
				query: data => ({
					url: 'Withdrawal/ManualApproval',
					method: 'POST',
					data,
				}),
				invalidatesTags: ['POST'],
			}
		),
		manualReject: builder.mutation<IAxiosResponse<null>, IManualOperatorArgs>({
			query: data => ({
				url: 'Withdrawal/ManualReject',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// 圖片存取
		getReceiptPicture: builder.query<string[], IGetByTransIdArgs>({
			query: ({ transId }) => ({
				// number = -1 取全部照片
				url: `Withdrawal/GetPicture?transId=${transId}&number=-1`,
				method: 'GET',
			}),
			providesTags: ['UPDATE_PIC'],
		}),
		uploadPicture: builder.mutation<IAxiosResponse<null>, IUploadPictureArgs>({
			query: data => ({
				url: 'Withdrawal/UploadPicture',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['UPDATE_PIC'],
		}),
		deletePicture: builder.mutation<IAxiosResponse<null>, IDeletePictureArgs>({
			query: data => ({
				url: 'Withdrawal/DeletePicture',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['UPDATE_PIC'],
		}),
		getWithdrawalReasonMessages: builder.query<
			IAxiosResponse<IWithdrawalReasonMessage[]>,
			null
		>({
			query: data => ({
				url: 'Withdrawal/WithdrawalMessageStatusList',
				method: 'POST',
				data,
			}),
		}),
		setWithdrawalMessage: builder.mutation<
			IAxiosResponse<null>,
			ISendWithdrawalMessageArgs
		>({
			query: data => ({
				url: 'Withdrawal/SetWithdrawalMessage',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// 取得限額調整紀錄
		getAdjustmentLimitLog: builder.query<
			IAdjustmentWithdrawalData,
			IGetAdjustmentLogArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetAdjustmentWithdrawalLimitLog',
				method: 'POST',
				data,
			}),
		}),
		getAssociateBankUser: builder.query<
			IAxiosResponse<ICustomerAssociateBankUserData[]>,
			IGetCustomerAssociateBankUserArgs
		>({
			query: data => ({
				url: 'Member/GetCustomerAssociateBankUser',
				method: 'POST',
				data,
			}),
		}),
		// 領單
		lockWithdrawal: builder.mutation<IAxiosResponse<null>, IReceiveArgs>({
			query: data => ({
				url: 'WithdrawalReceive/LockWithdrawal',
				method: 'POST',
				data,
			}),
		}),
		// 退單
		unLockWithdrawal: builder.mutation<IAxiosResponse<null>, IReceiveArgs>({
			query: data => ({
				url: 'WithdrawalReceive/UnLockWithdrawal',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// 蓋單
		setLockWithdrawalUser: builder.mutation<IAxiosResponse<null>, IReceiveArgs>(
			{
				query: data => ({
					url: 'WithdrawalReceive/SetLockWithdrawalUser',
					method: 'POST',
					data,
				}),
			}
		),
		// check 單 , 主管級才需要確認
		checkLockWithdrawalExists: builder.mutation<
			IAxiosResponse<null>,
			IReceiveArgs
		>({
			query: data => ({
				url: 'WithdrawalReceive/LockWithdrawalExists',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetWithdrawalListQuery,
	useGetWithdrawalByTransIdQuery,
	useGetWithdrawalCommentQuery,
	useExportWithdrawalListMutation,
	useSetWithdrawalStatusMutation,
	useManualApprovalMutation,
	useManualRejectMutation,
	useUploadPictureMutation,
	useGetReceiptPictureQuery,
	useDeletePictureMutation,
	useGetWithdrawalReasonMessagesQuery,
	useSetWithdrawalMessageMutation,
	useGetAdjustmentLimitLogQuery,
	useGetAssociateBankUserQuery,
	useLockWithdrawalMutation,
	useUnLockWithdrawalMutation,
	useSetLockWithdrawalUserMutation,
	useCheckLockWithdrawalExistsMutation,
} = withdrawalOperatorApi
