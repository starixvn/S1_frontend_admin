import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export interface IGetBlockEWalletAccArgs {
	accountNum: string
	userName: string
	blockStatus: number
	startDate: string
	endDate: string
	currencyId: number[]
	eWalletId: number[]
}

export interface IBlockEWalletAccData {
	custId: number
	userName: string
	eWalletName: string
	accountNum: string
	sysId: number
	createTime: string
	updateTime: string
	blockUpdateTime: string
	updateOperator: string
	status: number
	blockStatus: number
	currencyId: number
}

export type IBlockEWalletAccResponse = IAxiosResponse<IBlockEWalletAccData[]>

export interface IGetBlockEWalletListArgs {
	sysId: number
	accountNum: string
}

export interface IBlockEWalletData {
	userName: string
	custId: number
	siteId: number
	accountName: string
}

export type IBlockEWalletResponse = IAxiosResponse<IBlockEWalletData[]>

export interface IBlockEWalletForm {
	dateRange: [Moment, Moment]
	currencyIds: number[]
	blockStatus: number
	accountNum: string
	userName: string
	eWalletIds: number[]
}

export interface ISetBlockEWalletArgs {
	siteId?: number
	before: {
		sysId: number
		accountNum: string
		status: number
	}
	after: {
		sysId: number
		accountNum: string
		status: number
		memo: string
	}
}

export interface ISetReleaseEWalletArgs {
	siteId?: number
	before: {
		sysId: number
		accountNum: string
		custId: number
		ifscCode: string
	}
}

export interface IEWalletType {
	sysId: number
	eWalletName: string
	currencyId: number
}

export type IEWalletTypesResponse = IAxiosResponse<IEWalletType[]>
