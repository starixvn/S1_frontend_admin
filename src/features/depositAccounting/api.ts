import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IExportDepositAccountsFileArgs,
	IGetDepositAccountsArgs,
	IDepositAccountByTransIdResponse,
	IGetDepositAccountsResponse,
	IEditDepositAccountArgs,
} from './type'

export const depositAccountingApi = createApi({
	reducerPath: 'depositAccountingApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getDepositAccounts: builder.query<
			IGetDepositAccountsResponse,
			IGetDepositAccountsArgs
		>({
			query: data => ({
				url: 'DepositAccounting/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getDepositAccountByTransId: builder.query<
			IDepositAccountByTransIdResponse,
			string
		>({
			query: (transId: string) => ({
				url: 'DepositAccounting/GetByTransId',
				method: 'POST',
				data: { transId },
			}),
		}),
		editDepositAccount: builder.mutation<void, IEditDepositAccountArgs>({
			query: data => ({
				url: 'DepositAccounting/Edit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		exportDepositAccountsFile: builder.mutation<
			any,
			IExportDepositAccountsFileArgs
		>({
			query: data => ({
				url: 'DepositAccounting/ExportList',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetDepositAccountsQuery,
	useLazyGetDepositAccountByTransIdQuery,
	useEditDepositAccountMutation,
	useExportDepositAccountsFileMutation,
} = depositAccountingApi
