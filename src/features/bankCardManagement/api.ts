import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetAgentListArgs,
	IGetAgentListResponse,
	IGetBankCardListArgs,
	IGetBankCardListResponse,
	IGetBankInfoArgs,
	IGetBankInfoResponse,
	IGetPointLevelListArgs,
	IGetPointLevelListResponse,
	IGetPurposeEnumResponse,
	IGetSupportChannelEnumResponse,
	IGetStatusEnumResponse,
	ISetBankCardArgs,
	IGetQrCodeUrlResponse,
} from 'features/bankCardManagement/type'

export const bankCardManagementApi = createApi({
	reducerPath: 'bankCardManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
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
		// 狀態列表
		getStatusEnum: builder.query<IGetStatusEnumResponse, null>({
			query: () => ({
				url: 'Enum/GetEnumType',
				method: 'POST',
				data: {
					enumName: 'BankCardManagementStatusEnum',
				},
			}),
		}),
		// 取得目的列表
		getPurposeEnum: builder.query<IGetPurposeEnumResponse, null>({
			query: () => ({
				url: 'Enum/GetEnumType',
				method: 'POST',
				data: {
					enumName: 'BankCardManagementPurposeEnum',
				},
			}),
		}),

		getAgentList: builder.query<IGetAgentListResponse, IGetAgentListArgs>({
			query: data => ({
				url: 'BankTransferAccount/GetAgentList',
				method: 'POST',
				data,
			}),
		}),
		// 獲得渠道列表
		getSupportChannelEnum: builder.query<IGetSupportChannelEnumResponse, null>({
			query: () => ({
				url: 'Enum/GetEnumType',
				method: 'POST',
				data: {
					enumName: 'BankCardManagementSupportChannelEnum',
				},
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
	}),
})

export const {
	useLazyGetBankCardListQuery,
	useSetBankCardMutation,
	useGetPointLevelListQuery,
	useGetBankInfoQuery,
	useGetStatusEnumQuery,
	useGetPurposeEnumQuery,
	useGetAgentListQuery,
	useGetSupportChannelEnumQuery,
	useGetQrCodeUrlMutation,
} = bankCardManagementApi
