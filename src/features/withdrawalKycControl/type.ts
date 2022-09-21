import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetWithdrawalKycListArgs {
	siteId?: number
}

export interface IGetWithdrawalKycListData {
	siteId: number
	currencyId: number
	isoCode: string
	amount: number
}

export type IGetWithdrawalKycResponse = IAxiosResponse<
	IGetWithdrawalKycListData[]
>

export type IUpdateWithdrawalData = {
	amount: number
}

export interface IUpdateWithdrawalKycArgs {
	siteId?: number
	currencyId: number
	before: IUpdateWithdrawalData
	after: IUpdateWithdrawalData
}
