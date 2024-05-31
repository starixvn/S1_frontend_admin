import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Dayjs } from 'dayjs'

export interface IForm {
	currencyIds: number[]
	channels: number[]
	status: number[]
	purposes: ('all' | number)[]
	sysIds: number[]
	accountNo: string
	agent: string
}

export interface IAddEditForm {
	currencyId: number
	sysId: number | null
	channel: number
	status: number
	purposes: number[]
	accountNo: string | null
	agent: string | null
	accountName: string | null
	// * accountCode 現在只 for INR IFSC.使用
	accountCode: string | null
	displayName: string | null
	initialAmount: number
	initialTime: Dayjs | string
	maxBalanceAlertAmount: number
	reason: number
	remark: string | null
	payId: number
	bankLoginUrl: string | null
	bankLoginAccount: string | null
	bankLoginPassword: string | null
	transferPin: string | null
	loginPin: string | null
	mobilePin: string | null
	corporateID: string | null
	// for cryptoWallet
	cryptoCurrencyId: number | null
	network: string | null
}

export interface IBankTransferAccountsArgs {
	siteId?: number
	currencyIds: number[]
	channels: number[]
	agent: string
	status: number[]
	purposes: number[]
	sysIds: number[]
	accountNo: string
}

export interface IBankTransferAccountData {
	id: number
	siteId: number
	siteName: string | null
	currencyId: number
	isoCode: string | null
	sysId: number
	bankCode: string | null
	purpose: string | null
	purposes: number[]
	channel: number
	agent: string | null
	payId: number
	payName: string | null
	accountNo: string | null
	accountName: string | null
	accountCode: string | null
	displayName: string | null
	frontendDisplayName: string | null
	initialAmount: number
	initialTime: string
	maxBalanceAlertAmount: number
	reason: number
	remark: string | null
	status: number
	createTime: string | null
	creator: number
	creatorName: string | null
	updateTime: string | null
	updator: number
	updatorName: string | null
	bankLoginUrl: string | null
	bankLoginAccount: string | null
	bankLoginPassword: string | null
	transferPin: string | null
	loginPin: string | null
	mobilePin: string | null
	corporateID: string | null
	// for cryptoWallet
	cryptoCurrencyId: number | null
	network: string | null
}

export type IBankTransferAccountResponse = IAxiosResponse<
	IBankTransferAccountData[]
>

export interface ITransferAccountReasonData {
	description: string
	reasonId: number
}

export type ITransferAccountReasonsResponse = IAxiosResponse<
	ITransferAccountReasonData[]
>

export interface IBankTransferAccountPayData {
	id: number
	payName: string
	sort: string
	status: number
}

export type IBankTransferAccountPayListResponse = IAxiosResponse<
	IBankTransferAccountPayData[]
>

export interface ISetBankTransferAccountArgs extends IAddEditForm {
	id: number
	siteId?: number
}

export type ISetBankTransferAccountResponse = IAxiosResponse<void>

export interface IExportBankTransferAccountArgs {
	siteId?: number
	currencyIds: number[]
	channels: number[]
	agent: string
	status: number[]
	purposes: number[]
	sysIds: number[]
	accountNo: string | null
}

export interface IBankTransferAccountByIdData {
	accountCode: string | null
	accountName: string | null
	accountNo: string | null
	agent: string | null
	bankCode: string | null
	channel: number
	createTime: string | null
	creator: number
	creatorName: string | null
	currencyId: number
	displayName: string | null
	id: number
	initialAmount: number
	initialTime: string
	isoCode: string | null
	maxBalanceAlertAmount: number
	payId: number
	payName: string | null
	purpose: string | null
	purposes: number[]
	reason: number
	remark: null
	siteId: number
	siteName: string | null
	status: number
	sysId: number
	updateTime: string | null
	updator: number
	updatorName: string | null
}

export type IBankTransferAccountByIdResponse =
	IAxiosResponse<IBankTransferAccountByIdData>

export type IBankTransferAccountAgentListResponse = IAxiosResponse<string[]>
