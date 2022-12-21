import { rootApi } from 'common/service/rootApi/api'
import {
	ICalCodeData,
	IDeletePictureArgs,
	IExportWithdrawalListArgs,
	IGetBankCodeData,
	IGetBankCodeListArgs,
	IGetBankInfoData,
	IGetBankInfoListArgs,
	IGetByTransIdArgs,
	IGetCryptoPayData,
	IGetCryptoPayListArgs,
	IGetCryptoWalletArgs,
	IGetCryptoWalletData,
	IGetOnlinePayData,
	IGetOnlinePayListArgs,
	IGetVipLevelBySiteArgs,
	IGetWithdrawalData,
	IGetWithdrawalListArgs,
	IGetWithdrawalResponse,
	IManualOperatorArgs,
	ISetWithdrawalStatusArgs,
	IUploadPictureArgs,
	IVipLevelData,
	IWithdrawalCommentData,
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
		getCalCodeLis: builder.query<
			IAxiosResponse<ICalCodeData[]>,
			{ siteId?: number }
		>({
			query: data => ({
				url: 'BaseData/GetCalCodeList',
				method: 'POST',
				data,
			}),
		}),
		getBankCodeList: builder.query<
			IAxiosResponse<IGetBankCodeData[]>,
			IGetBankCodeListArgs
		>({
			query: data => ({
				url: 'BaseData/GetBankCodeList',
				method: 'POST',
				data,
			}),
		}),
		getVipLevelList: builder.query<
			IAxiosResponse<IVipLevelData[]>,
			IGetVipLevelBySiteArgs
		>({
			query: data => ({
				url: 'BaseData/GetVipLevelSettingBySiteId',
				method: 'POST',
				data,
			}),
		}),
		// 取得用戶 onlinePayList 列表
		getOnlinePayList: builder.query<
			IAxiosResponse<IGetOnlinePayData[]>,
			IGetOnlinePayListArgs
		>({
			query: data => ({
				url: 'BaseData/GetOnlinePayList',
				method: 'POST',
				data,
			}),
		}),
		// 取得用戶 cryptoPayList 列表
		getCryptoPayList: builder.query<
			IAxiosResponse<IGetCryptoPayData[]>,
			IGetCryptoPayListArgs
		>({
			query: data => ({
				url: 'BaseData/GetCryptoPayList',
				method: 'POST',
				data,
			}),
		}),
		getCryptoWalletList: builder.query<
			IAxiosResponse<IGetCryptoWalletData[]>,
			IGetCryptoWalletArgs
		>({
			query: data => ({
				url: 'BaseData/GetCryptoWalletList',
				method: 'POST',
				data,
			}),
		}),
		getLocalBankList: builder.query<
			IAxiosResponse<IGetBankInfoData[]>,
			IGetBankInfoListArgs
		>({
			query: data => ({
				url: 'BaseData/GetBankInfoOffList',
				method: 'POST',
				data,
			}),
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
	}),
})

export const {
	useLazyGetWithdrawalListQuery,
	useGetWithdrawalByTransIdQuery,
	useGetWithdrawalCommentQuery,
	useGetCalCodeLisQuery,
	useGetBankCodeListQuery,
	useExportWithdrawalListMutation,
	useGetVipLevelListQuery,
	useSetWithdrawalStatusMutation,
	useGetOnlinePayListQuery,
	useGetCryptoPayListQuery,
	useGetCryptoWalletListQuery,
	useGetLocalBankListQuery,
	useManualApprovalMutation,
	useManualRejectMutation,
	useUploadPictureMutation,
	useGetReceiptPictureQuery,
	useDeletePictureMutation,
} = withdrawalOperatorApi
