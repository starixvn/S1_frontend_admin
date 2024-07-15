import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetDepositLimitArgs {
	siteId?: number
	currencyId: number
}

export interface IGetDepositLimitData {
	vipLevel: number
	depositMin: number
	depositMax: number
	depositStatus: number
	siteId: number
	depositType: number
	currencyId: number
}

export type IGetDepositLimitResponse = IAxiosResponse<IGetDepositLimitData[]>

export type IUpdateDepositLimitData = {
	depositType: number
	vipLevel: number
	depositMin: number | null
	depositMax: number | null
	depositStatus: number | null
}

export interface IUpdateDepositLimitArgs extends IGetDepositLimitArgs {
	before: IUpdateDepositLimitData[]
	after: IUpdateDepositLimitData[]
}

export interface ICreateDepositLimitArgs extends IGetDepositLimitArgs {
	after: IUpdateDepositLimitData[]
}

export type IDeleteDepositLimitData = {
	vipLevel: number
}

export interface IDeleteDepositLimitArgs extends IGetDepositLimitArgs {
	before: IDeleteDepositLimitData
}

export type IDepositTableData = {
	vipLevel: number
	onlineBankingMax: number | null
	onlineBankingMin: number | null
	onlineBankingStatus: number | null
	mobilePayMax: number | null
	mobilePayMin: number | null
	mobilePayStatus: number | null
	localBankingMax: number | null
	localBankingMin: number | null
	localBankingStatus: number | null
	quickTransferMax: number | null
	quickTransferMin: number | null
	quickTransferStatus: number | null
	cryptoPayMax: number | null
	cryptoPayMin: number | null
	cryptoPayStatus: number | null
	loadCardMax: number | null
	loadCardMin: number | null
	loadCardStatus: number | null
	cryptoWalletMax: number | null
	cryptoWalletMin: number | null
	cryptoWalletStatus: number | null
	chatTransferMax: number | null
	chatTransferMin: number | null
	chatTransferStatus: number | null
}

// form 在 input 就不允許有 null , switch 可能有 number , boolean , null
export type IDepositTableFormData = {
	vipLevel: number
	onlineBankingMax: number
	onlineBankingMin: number
	onlineBankingStatus: number | boolean | null
	mobilePayMax: number
	mobilePayMin: number
	mobilePayStatus: number | boolean | null
	localBankingMax: number
	localBankingMin: number
	localBankingStatus: number | boolean | null
	quickTransferMax: number
	quickTransferMin: number
	quickTransferStatus: number | boolean | null
	cryptoPayMax: number
	cryptoPayMin: number
	cryptoPayStatus: number | null
	loadCardMax: number
	loadCardMin: number
	loadCardStatus: number | null
	cryptoWalletMax: number
	cryptoWalletMin: number
	cryptoWalletStatus: number | null
	chatTransferMax: number
	chatTransferMin: number
	chatTransferStatus: number | null
}

export enum ErrorCodeEnum {
	DuplicatePointLevel = -5,
}
