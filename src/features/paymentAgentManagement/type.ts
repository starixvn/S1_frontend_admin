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

export interface IEditForm {
	agentId: number
	agentName: string
	siteIds: number[]
	currencyIds: number[]
	type: number
	status: number
}

export interface IModalForm {}

export interface ISetPaymentAgentStatusArgs {
	agentId: 2
	status: 0
}

export interface ISetPaymentAgentArgs {
	agentId: number
	agentName: string
	type: number
	siteIds: number[]
	currencyIds: number[]
	status: number
}

export interface ISetPaymentAgentUserArgs {
	userId: number
	agentId: number
	userName: string
	password: string
	siteIds: number[]
	currencyIds: number[]
	groupIds: number[]
}

export interface ISetPaymentAgentUserStatusArgs {
	userId: number
	status: number
}

export interface IGetPaymentAgentUserArgs {
	agentId: number
}
