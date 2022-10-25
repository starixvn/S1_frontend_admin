import { rootApi } from '../rootApi/api'
import { BankInfoOffResponse } from './type'

export const GET_BANK_INFO_OFF_LIST_ARGS = {
	PURPOSE: {
		DEPOSIT: 1,
		WITHDRAWAL: 2,
		DEPOSIT_WITHDRAWAL: 3,
	},
}

export const baseDataApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBankInfoOffList: builder.query<
			BankInfoOffResponse,
			{
				siteId?: number
				currencyId?: number
				purpose?: number
			}
		>({
			query: data => ({
				url: 'BaseData/GetBankInfoOffList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useGetBankInfoOffListQuery } = baseDataApi
