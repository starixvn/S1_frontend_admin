import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IGetAgentListArgs,
	IGetAgentListResponse,
	IGetBankCardListArgs,
	IGetBankCardListResponse,
	IGetBankInfoArgs,
	IGetBankInfoResponse,
	IGetPointLevelListArgs,
	IGetPointLevelListResponse,
	ISetBankCardArgs,
	IGetQrCodeUrlResponse,
	ISelectListPaymentAgentResponse,
} from 'features/bankCardManagement/type'

export const bankCardManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// 取得銀行卡設定
		getBankCardList: builder.query<
			IGetBankCardListResponse,
			IGetBankCardListArgs
		>({
			query: data => ({
				url: 'BankCardManagement/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// 設定銀行卡
		setBankCard: builder.mutation<IAxiosResponse<null>, ISetBankCardArgs>({
			query: data => ({
				url: 'BankCardManagement/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getPointLevelList: builder.query<
			IGetPointLevelListResponse,
			IGetPointLevelListArgs
		>({
			query: data => ({
				url: 'BaseData/GetPointLevelList',
				method: 'POST',
				data,
			}),
		}),
		// 銀行資訊
		getBankInfo: builder.query<IGetBankInfoResponse, IGetBankInfoArgs>({
			query: data => ({
				url: 'BaseData/GetBankInfoSys',
				method: 'POST',
				data,
			}),
		}),
		// 獲得 qrCodeUrl
		getQrCodeUrl: builder.mutation<IGetQrCodeUrlResponse, FormData>({
			query: data => ({
				url: 'BankCardManagement/GetQrCodeUrl',
				method: 'POST',
				data,
			}),
		}),
		checkQrCodeImg: builder.mutation<IAxiosResponse<null>, FormData>({
			query: data => ({
				url: 'Common/CheckQrCodeImg',
				method: 'POST',
				data,
			}),
		}),
		getPaymentAgentSelectList: builder.query<
			ISelectListPaymentAgentResponse,
			null
		>({
			query: () => ({
				url: 'PaymentAgent/GetSelectList',
				method: 'POST',
			}),
		}),
	}),
})

export const {
	useLazyGetBankCardListQuery,
	useSetBankCardMutation,
	useGetPointLevelListQuery,
	useGetBankInfoQuery,
	useGetQrCodeUrlMutation,
	useCheckQrCodeImgMutation,
	useGetPaymentAgentSelectListQuery,
} = bankCardManagementApi
