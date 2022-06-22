export interface IBlockBankAccState {
	accountName: string
	accountNum: string
	bankName: string
	createTime: string
	status: number
	sysId: number
	updateOperator: null | string
	updateTime: null | string
	blockUpdateTime: null | string
	userName: string
}

export interface IGetBlockBankAccArgs {
	accountNum: string
	userName: string
	status: number
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

export interface ISetBlockAccountArgs {
	sysId: number
	accountNum: string
	status: number
	memo: string
}

export interface ISetReleaseAccountArgs {
	sysId: number
	accountNum: string
	custId: number
	ifscCode: string
}
