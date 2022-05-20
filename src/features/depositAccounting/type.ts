import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IDepositAccountsState {
	siteName: string
	transId: string
	userName: string
	custId: number
	currencyId: number
	currency: string
	amount: number
	bankName: string
	accountNo: string
	memo: string
	operator: string
	approvedTime: string
	latestUpdateOperator: string
	latestUpdateTime: string
}

export type IGetDepositAccountsResponse = IAxiosResponse<
	IDepositAccountsState[]
>

export interface IGetDepositAccountsArgs {
	siteIds: number[]
	currencyIds: number[]
	transId: string
	userName: string
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export interface IExportDepositAccountsFileArgs {
	siteIds: number[]
	currencyIds: number[]
	transId: string
	userName: string
	startDate: string
	endDate: string
}

export interface IEditDepositAccountArgs {
	transId: string
	accountNo: string
	memo: string
}

export interface IDepositAccountState {
	accountNo: string
	amount: number
	approvedTime: string
	bankName: string
	currency: string
	currencyId: number
	custId: number
	latestUpdateOperator: string
	latestUpdateTime: string
	memo: null | string
	operator: string
	siteName: string
	transId: string
	userName: string
}

export type IDepositAccountByTransIdResponse =
	IAxiosResponse<IDepositAccountState>
