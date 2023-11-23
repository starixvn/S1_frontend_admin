// 取得支付第三方列表

export interface IGetGlobalStatusArgs {
	siteId?: number
}

export interface IGetGlobalStatusData {
	payId: number
	payName: string
	status: number
	loginAccount: string
	loginPassword: string
	loginPin: string
	loginUrl: string
	transferPin: string
}

// 設定支付第三方狀態 , GlobalStatus
export interface ISetGlobalStatusArgs {
	siteId?: number
	payId: number
	status: number
}

// 設定支付三方後台登入資訊
export interface ISetPayListLoginInfoArgs {
	siteId?: number
	payId: number
	loginUrl: string
	loginAccount: string
	loginPassword: string
	transferPin: string
	loginPin: string
}

export type ILoginInfoForm = {
	loginUrl: string
	loginAccount: string
	loginPassword: string
	transferPin: string
	loginPin: string
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
	chargeFeePercentage: number
	chargeFeePreCount: number
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
	currencyId: number
	channelId: number
}

export interface IGetBankInfoData {
	id: number
	bankCode: string
	bankName: string
	status: number
	currencyId: number
	method: number
	channelId: number
}

// 更新三方支援銀行狀態
export interface ISetBankStatusArgs {
	siteId?: number
	payId: number
	sysId: number
	status: number
	channelId: number
}

export enum AmountRuleEnum {
	Integer = 1,
	Fixed = 3,
}

export type IFilterForm = {
	currencyIds: number[]
	method: number
	payId: number | string
	type: number | string
	globalStatus: number | string
	status: number | string
}

export type IEditForm = {
	channelId: number
	currencyId: number
	minAmount: number
	maxAmount: number
	amountRule: number
	fixedAmountList: string
	pointLevel: number
	sort: number
	channelName: string
	type: number
	percentage: number
	preCount: number
	editType: number
}

export interface IGetCryptoInfoData {
	currencyId: number
	currencyName: string
	network: string
	networkType: number
	status: number
}

export interface ISetCryptoInfoArgs {
	currencyId: number
	network: number
	status: number
}

export interface ISetPaySettingChargeFeeArgs {
	siteId?: number
	currencyId: number
	channelId: number
	percentage: number
	preCount: number
}

export enum EditModalTypeEnum {
	Edit,
	FeeSetting,
}

export interface IWithdrawalTypeData {
	name: string
	value: number
}

export type IEditAutoWithdrawalRuleForm = {
	id: number
	status: number
	currencyName: string
	withdrawalAmount: number
	accountWithdrawalCount: number
	vipLevels: number[]
	tags: number[]
	withdrawalType: number
}

export type IAddAutoWithdrawalRuleForm = {
	currencyId: number
	withdrawalAmount: number
	accountWithdrawalCount: number
	vipLevels: number[]
	tags: number[]
	withdrawalType: number
}

export interface IAutoVerifyRuleData {
	currencyId: number
	isoCode: string
	withdrawalAmount: number
	accountWithdrawalCount: number
	vipLevels: number[]
	tags: number[]
	deviceLevel: string[]
	deviceScores: number
	id: number
	status: number
	createTime: string
	createUser: string
	lastUpdateTime: string
	lastUpdateUser: string
	withdrawalType: number
}

export interface IGetAutoVerifyRuleArgs {
	siteId?: number
	autoType?: number
}

export interface IAddAutoVerifyRuleArgs {
	autoType: number
	siteId?: number
	currencyId: number
	withdrawalAmount: number
	accountWithdrawalCount: number
	vipLevels: number[]
	tags: number[]
	deviceLevel: string[]
	deviceScores?: number // *
	withdrawalType?: number // * Auto Verify Rule Modal 沒有這個值 --> 帶空
}

export interface ISetAutoVerifyRuleArgs {
	id: number
	siteId?: number
	currencyId: number
	withdrawalAmount: number
	accountWithdrawalCount: number
	vipLevels: number[]
	tags: number[]
	deviceLevel: string[]
	deviceScores?: number // *
	status: number
	withdrawalType?: number // * Auto Verify Rule Modal 沒有這個值 --> 帶空
}

export interface IDeleteAutoVerifyRuleArgs {
	id: number
}

export type IEditAutoVerifyRuleForm = {
	id: number
	siteId?: number
	currencyId: number
	withdrawalAmount: number
	accountWithdrawalCount: number
	vipLevels: number[]
	tags: number[]
	deviceLevel: string[]
	deviceScores: number
	status: number
}

export type IAddAutoVerifyRuleForm = {
	autoType: number
	siteId?: number
	currencyId: number
	withdrawalAmount: number
	accountWithdrawalCount: number
	vipLevels: number[]
	tags: number[]
	deviceLevel: string[]
	deviceScores: number
}

export enum AutoTypeEnums {
	AutoVerify = 1,
	AutoApproved,
}

export enum AutoTypeDisplayNameEnums {
	AutoVerify = 'AutoVerify',
	AutoApproved = 'AutoApproved',
}

export interface IWithdrawalBlockSwitchData {
	currencyId: number
	type: number
	status: boolean
}

export interface ISetWithdrawalBlockSwitchArgs {
	currencyId: number
	type: number
	status: boolean
}

export enum MethodsTypeEnums {
	Deposit = 1,
	Withdrawal,
}

export interface ISystemBankInfoData {
	sysId: number
	currencyId: number
	isoCode: string
	bankCode: string
	bankName: string
	status: number
}

export interface ISetSystemBankInfoArgs {
	sysId: number
	bankCode: string
	bankName: string
	status: number
}
