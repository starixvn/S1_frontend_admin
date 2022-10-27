// 取得支付第三方列表
export interface IGetGlobalStatusArgs {
	siteId?: number
}

export interface IGetGlobalStatusData {
	payId: number
	payName: string
	payStatus: number
	sitePayStatus: number
	status: number
}

// 設定支付第三方狀態 , GlobalStatus
export interface ISetGlobalStatusArgs {
	siteId?: number
	payId: number
	status: number
}

export enum PaymentStatusEnum {
	True = 1,
	False,
}

// 取得支付設定列表
export interface IGetPaySettingListArgs {
	siteId?: number
	currencyIds: number[]
	method: number | null
	payId: number | null
	type: number | null
	globalStatus: number | null
	status: number | null
	pageNumber: number
	pageSize: number
}

export interface IGetPaySettingData {
	currencyId: number
	payId: number
	payName: string
	channelId: number
	channelName: string
	type: number
	mode: number
	minAmount: number
	maxAmount: number
	amountRule: number
	fixedAmountList: number[]
	pointLevel: number
	sort: number
	status: number
	globalstatus: number
	method: number
}

// 支付三方設定
// fixedAmountList  amountRule=3 時才要帶
export interface ISetPaySettingArgs {
	siteId?: number
	currencyId: number
	channelId: number
	minAmount: number
	maxAmount: number
	amountRule: number
	fixedAmountList: null | number[]
	pointLevel: number
	sort: number
}

// 支付三方狀態設定
export interface ISetPaySettingStatusArgs {
	siteId?: number
	currencyId: number
	channelId: number
	status: number
}

// 取得第三方支援的銀行
export interface IGetBankInfoArgs {
	siteId?: number
	payId: number
}

export interface IGetBankInfoData {
	id: number
	bankCode: string
	bankName: string
	status: number
	currencyId: number
}

// 更新三方支援銀行狀態
export interface ISetBankStatusArgs {
	siteId?: number
	payId: number
	sysId: number
	status: number
}

export enum AmountRuleEnum {
	Integer = 1,
	Fixed = 3,
}
