import { Moment } from 'moment'

export interface ICryptoCurrency {
	currencyId: number
	currencyName: string
}

export interface ICryptoNetwork {
	networkType: number
	currencyId: number
	network: string
}

export interface ICryptoInfoData {
	cryptoCurrency: ICryptoCurrency[]
	cryptoNetwork: ICryptoNetwork[]
}

export interface IBlockCryptoWalletData {
	custId: number
	userName: string
	accountName: string
	createTime: string
	updateTime: string
	blockUpdateTime: string | null
	updateOperator: string | null
	status: number
	blockStatus: number
	currencyId: number
	network: string
	address: string
	cryptoType: string
}

export interface IGetBlockCryptoWalletArgs {
	address: string
	userName: string
	status: number
	startDate: string
	endDate: string
	currencyId: number[]
	cryptoType: number[]
	network: number[]
}

export interface ICryptoWalletGetByAddress {
	userName: string
	custId: number
	siteId: number
	accountName: string
	address: string
	network: string
	nickName: string
	currencyId: number
}

export interface ICryptoWalletGetByAddressArgs {
	address: string
}

export interface IBlockCryptoWalletSetArgs {
	siteId?: number
	before: {
		address?: string
		status?: number
	}
	after: {
		address?: string
		status?: number
		memo: string
	}
}

export interface IReleaseCryptoWalletArgs {
	siteId?: number
	currencyId?: number
	before: {
		address: string
		network: string
		currencyId?: number
		custId: number
	}
}

export interface IGetCryptoListByCustIdArgs {
	custId: number
}

export type IFilterForm = {
	dateRange: [Moment, Moment]
	currencyId: number[]
	status: number
	cryptoType: number[]
	network: number[]
	address: string
	userName: string
}

export type IAddForm = {
	address: string
}
