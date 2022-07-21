import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetEWalletListArg {
	siteId?: number
}

export interface IGetEWalletListData {
	siteId: number
	currencyId: number
	withdrawalMin: number
	withdrawalMax: number
	updateTime: string
	updateOperator: string
	status: number
	isoCode: string
}

export type IGetEWalletListResponse = IAxiosResponse<IGetEWalletListData[]>

export type IWithdrawalValue = {
	withdrawalMin: number
	withdrawalMax: number
}
export interface IUpdateEWalletArgs {
	siteId?: number
	currencyId: number
	after: IWithdrawalValue
	before: IWithdrawalValue
}

export type IStatusValue = {
	status: number
}

export interface ISwitchStatusArgs {
	siteId?: number
	currencyId: number
	after: IStatusValue
	before: IStatusValue
}
