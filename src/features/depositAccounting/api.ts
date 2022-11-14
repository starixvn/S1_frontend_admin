import { rootApi } from 'common/service/rootApi/api'
import {
	IExportDepositAccountsFileArgs,
	IGetDepositAccountsArgs,
	IDepositAccountByTransIdResponse,
	IGetDepositAccountsResponse,
	IEditDepositAccountArgs,
} from './type'

export const depositAccountingApi = rootApi.injectEndpoints({
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
			Blob,
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
