import type { GetPaymentAgentListArgs, PaymentAgentResponse } from './type'
import { rootApi } from '../../common/service/rootApi/api'

export const paymentAgentApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPaymentAgentList: builder.query<
			PaymentAgentResponse,
			GetPaymentAgentListArgs
		>({
			query: data => ({
				url: 'PaymentAgent/GetList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useLazyGetPaymentAgentListQuery } = paymentAgentApi
