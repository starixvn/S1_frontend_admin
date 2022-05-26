import { IAxiosResponse } from '../axiosBaseQuery'

export interface IBankInfoOffState {
	bankId: number
	accountName: string
	accountNo: string
	accountStatus: number
	sysId: number
	minAmount: number
	maxAmount: number
	pointLevel: number
	purpose: number
	memo: null | string
	bSort: number
	currencyId: number
	bankCode: string
	bankName: string
	bankStatus: null | number
	bankLogo: string
	bankSite: string
	sort: number
	ver: number
}

export type BankInfoOffResponse = IAxiosResponse<IBankInfoOffState[]>
