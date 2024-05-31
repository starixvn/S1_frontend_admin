import { Dayjs } from 'dayjs'

export interface IForm {
	dateRange: [Dayjs, Dayjs]
	currencyIds: number[]
	blockStatus: number
	userName: string
	accountNum: string
}
export interface IBlockBankAccState {
	accountName: string
	accountNum: string
	bankName: string
	createTime: string
	status: number
	blockStatus: number
	sysId: number
	updateOperator: null | string
	updateTime: null | string
	blockUpdateTime: null | string
	userName: string
	currencyId: number
	custId: number
	ifscCode: null | string
}

export interface IGetBlockBankAccArgs {
	accountNum: string
	userName: string
	blockStatus: number
	startDate: string
	endDate: string
	currencyId: number[]
}

export interface IBlockBankAccListResponse {
	accountName: string
	custId: number
	ifscCode: string
	siteId: number
	userName: string
}

export interface IGetBlockBankAccListArgs {
	sysId: number
	accountNum: string
}

// ! ISetBlockAccountArgs 的 status 是更動 IBlockBankAccState 的 blockStatus 的值
export interface ISetBlockAccountArgs {
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

export interface ISetReleaseAccountArgs {
	siteId?: number
	before: {
		sysId: number
		accountNum: string
		custId: number
		ifscCode: string
	}
}
