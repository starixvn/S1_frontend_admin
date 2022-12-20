import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IDeleteBankTransferArgs,
	IExportBankTransferListArgs,
	IGetBankInfoResponse,
	IGetBankTransferListArgs,
	IGetBankTransferListResponse,
	IGetByTransferIdArgs,
	IGetByTransferIdResponse,
	IGetReasonListResponse,
	IGetTransactionTypeResponse,
	IGetTransferAccountListArgs,
	IGetTransferAccountListResponse,
	IGetTransferTypeResponse,
} from 'features/transferInfoManagement/type'

export const transferInfoManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// 取得 TransferType 列表
		getTransferTypeList: builder.query<IGetTransferTypeResponse, null>({
			query: () => ({
				url: 'BankTransfer/GetTransferTypeList',
				method: 'POST',
			}),
		}),
		getTransactionTypeList: builder.query<IGetTransactionTypeResponse, null>({
			query: () => ({
				url: 'BankTransfer/GetTransactionTypeList',
				method: 'POST',
			}),
		}),
		// 取得原因列表
		getTransferReasonList: builder.query<IGetReasonListResponse, null>({
			query: () => ({
				url: 'BaseData/GetReasonList',
				method: 'POST',
				data: { FuncKey: 'BankFinancial/TransferAccountManage' },
			}),
		}),
		// 取得轉帳帳戶列表
		// 列表下拉選單顯示全部(Value=>accountNo, Name=>displayName)
		// 編輯只顯示status === 2的項目
		getTransferAccountList: builder.query<
			IGetTransferAccountListResponse,
			IGetTransferAccountListArgs
		>({
			query: data => ({
				url: 'BaseData/GetTransferAccountList',
				method: 'POST',
				data,
			}),
		}),
		getBankTransferList: builder.query<
			IGetBankTransferListResponse,
			IGetBankTransferListArgs
		>({
			query: data => ({
				url: 'BankTransfer/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getBankCodeInfo: builder.query<IGetBankInfoResponse, null>({
			query: () => ({
				url: 'GetAllData/GetBankInfoSys',
				method: 'POST',
			}),
		}),
		exportBankTransferList: builder.mutation<Blob, IExportBankTransferListArgs>(
			{
				query: data => ({
					url: 'BankTransfer/Export',
					method: 'POST',
					data,
					responseType: 'blob',
				}),
			}
		),
		getByTransferId: builder.query<
			IGetByTransferIdResponse,
			IGetByTransferIdArgs
		>({
			query: data => ({
				url: 'BankTransfer/GetByTransferId',
				method: 'POST',
				data,
			}),
		}),
		setBankTransfer: builder.mutation<void, FormData>({
			query: data => ({ url: 'BankTransfer/Set', method: 'POST', data }),
			invalidatesTags: ['POST'],
		}),
		deleteBankTransfer: builder.mutation<
			IAxiosResponse<null>,
			IDeleteBankTransferArgs
		>({
			query: data => ({
				url: 'BankTransfer/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetTransferTypeListQuery,
	useGetTransactionTypeListQuery,
	useGetTransferReasonListQuery,
	useGetTransferAccountListQuery,
	useLazyGetBankTransferListQuery,
	useExportBankTransferListMutation,
	useLazyGetByTransferIdQuery,
	useSetBankTransferMutation,
	useDeleteBankTransferMutation,
	useGetBankCodeInfoQuery,
} = transferInfoManagementApi
