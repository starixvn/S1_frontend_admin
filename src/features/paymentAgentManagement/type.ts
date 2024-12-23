import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface GetPaymentAgentListArgs {
	types: number[]
	status: number[]
}

export interface IPaymentAgentData {
	agentId: number
	agentName: string
	siteIds: number[]
	currencyIds: number[]
	type: number
	status: number
}

export type PaymentAgentResponse = IAxiosResponse<IPaymentAgentData[]>

export interface IFilterForm {
	types: number[]
	status: number[]
}
