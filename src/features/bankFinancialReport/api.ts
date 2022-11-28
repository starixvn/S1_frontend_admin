import { rootApi } from 'common/service/rootApi/api'
import {
	IGetBankFinancialReportArgs,
	IGetBankFinancialReportData,
	IGetFinancialAccountData,
	IGetFinancialAccountListArgs,
} from 'features/bankFinancialReport/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const bankFinancialReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBankFinancialReport: builder.query<
			IAxiosResponse<IGetBankFinancialReportData[]>,
			IGetBankFinancialReportArgs
		>({
			query: data => ({
				url: 'BankFinancialReport/Get',
				method: 'POST',
				data,
			}),
		}),
		exportBankFinancialReport: builder.mutation<
			Blob,
			IGetBankFinancialReportArgs
		>({
			query: data => ({
				url: 'BankFinancialReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getFinancialAccountList: builder.query<
			IAxiosResponse<IGetFinancialAccountData[]>,
			IGetFinancialAccountListArgs
		>({
			query: data => ({
				url: 'BaseData/GetFinancialAccountList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetBankFinancialReportQuery,
	useExportBankFinancialReportMutation,
	useGetFinancialAccountListQuery,
} = bankFinancialReportApi
