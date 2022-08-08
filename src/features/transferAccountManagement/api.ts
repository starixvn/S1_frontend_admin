import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IBankTransferAccountByIdResponse,
	IBankTransferAccountPayListResponse,
	IBankTransferAccountResponse,
	IBankTransferAccountsArgs,
	IExportBankTransferAccountArgs,
	ISetBankTransferAccountArgs,
	ISetBankTransferAccountResponse,
	ITransferAccountReasonsResponse,
} from './type'

export const transferAccountManagementApi = createApi({
	reducerPath: 'transferAccountManagementApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		// * 取得轉帳帳戶列表
		getBankTransferAccounts: builder.query<
			IBankTransferAccountResponse,
			IBankTransferAccountsArgs
		>({
			query: data => ({
				url: 'BankTransferAccount/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 取得轉帳帳戶資訊
		getBankTransferAccountById: builder.query<
			IBankTransferAccountByIdResponse,
			{ id: number }
		>({
			query: data => ({
				url: 'BankTransferAccount/GetById',
				method: 'POST',
				data,
			}),
		}),
		// * 取得轉帳帳戶原因
		getBankTransferAccountReasons: builder.query<
			ITransferAccountReasonsResponse,
			null
		>({
			query: data => ({
				url: 'BankTransferAccount/GetTransferAccountReason',
				method: 'POST',
				data,
			}),
		}),
		// * 取得金流商列表
		getBankTransferAccountPayList: builder.query<
			IBankTransferAccountPayListResponse,
			null
		>({
			query: data => ({
				url: 'BankTransferAccount/GetPayList',
				method: 'POST',
				data,
			}),
		}),
		// * 新增(Id=0)/更新轉帳帳戶資訊
		setBankTransferAccount: builder.mutation<
			ISetBankTransferAccountResponse,
			ISetBankTransferAccountArgs
		>({
			query: data => ({
				url: 'BankTransferAccount/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 匯出轉帳帳戶列表
		exportBankTransferAccount: builder.mutation<
			Blob,
			IExportBankTransferAccountArgs
		>({
			query: data => ({
				url: 'BankTransferAccount/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetBankTransferAccountsQuery,
	useGetBankTransferAccountByIdQuery,
	useGetBankTransferAccountReasonsQuery,
	useGetBankTransferAccountPayListQuery,
	useSetBankTransferAccountMutation,
	useExportBankTransferAccountMutation,
} = transferAccountManagementApi
