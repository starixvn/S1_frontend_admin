import { Key } from 'react'
import { Moment } from 'moment'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const AllSiteId = 0

export enum DepositStatusEnum {
	Draft = 0,
	Pending,
	Paid,
	Approved,
	Rejected,
	Canceled,
	Expired,
	OnHold,
	Adjustment,
	Error,
	ManualApproved = 9999,
}

export enum UsableActionButtonEnum {
	Rejected = 6,
	OnHold = 63,
	Pending = 64,
	Approved = 65,
	Draft = 66,
	ManualApproved = 67,
	ManualRejected = 68,
	Verified = 69,
	Process = 70,
	ToKyc = 71,
}

export enum VipLevelEnum {
	VintageClub = 1,
	SilverClub,
	GoldClub,
	TitaniumClub,
	DiamondClub,
	NovaClub,
}

export interface IGetDepositOperatorListArgs {
	siteId: number
	startDate: string | null
	endDate: string | null
	depositId: string | null // * 帶 null 代表全選，不知道空字串全選
	userName: string
	selectBankCode: number[]
	selectCalCode: number[]
	selectPayId: number[]
	startAmount: number // * -1 代表不限制
	endAmount: number // * -1 代表不限制
	pageSize: number
	pageNumber: number
	depositTypes: number[]
	statuses: number[]
	currencyIds: number[]
	levelStatuses: number[]
	agent: string
}

export interface ICurrencyAmountRecord {
	amount: number
	currency: string
	record: number
}

export interface IDepositOperatorResponse
	extends IAxiosResponse<IDepositOperatorData[]> {
	currencyAmountRecord: ICurrencyAmountRecord[]
}

/**
 * * 轉回來預期為 Object，用到 channelName、exchangeAmount、actualExchangeAmount、sysId
 */
export interface IDepositInfo {
	payId?: number
	sysId?: number
	accountNo?: string
	accountName?: string
	channelName?: string
	exchangeAmount?: number
	actualExchangeAmount?: number
}

export interface IDepositFrom {
	sysId: number
	bankName?: string | undefined
	accountName: string | undefined
}

export interface IODepositInfo {
	channelId?: number
	currencyId?: number
	payId?: number
	ver?: number
}

export interface IDepositOperatorData {
	transId: string
	depositId: number
	depositType: number
	depositTypeName: string
	currencyId: number
	isoCode: string
	custId: number
	userName: string | null
	email: string | null
	realName: string | null
	siteId: number
	siteName: string | null
	bankId: number
	depositInfo: IDepositInfo
	amount: number
	actualDeposit: number
	comment: string | null
	createTime: string | null
	oDepositInfo: IODepositInfo
	firstDeposit: number
	status: number
	statusName: string
	usableActionButton: number[]
	receipt: boolean
	refId: string | null
	depositTime: string | null
	accountName: string | null
	accountNo: string | null
	bankName: string | null
	bankCode: string | null
	payName: string | null
	picFileName: string | null
	displayName: string | null
	calCode: string | null
	isKyc: number
	isRisk: number
	vipLevelName: string | null
	depositCnt: number
	flag: number
	updateTime: string | null
	statementTime: string | null
	flowEndTime: string | null
	channelName: string | null
	vipLevel: number
	operator: string | null
	agent: string | null
	depositFrom: IDepositFrom
	fromAccountNo: string
	fromBankCode: string
	fromBankName: string
	bonusDescription: string
}

export interface IForm {
	dateRange: [Moment, Moment]
	currencyIds: number[]
	statuses: number[]
	selectPayIds: number[]
	selectBankCode: number[]
	depositTypes: number[]
	userName: string
	startAmount: number
	endAmount: number
	levelStatuses: number[]
	agent: string
	depositId: string
	selectCalCode: number[]
	isAllSite: boolean
}

export interface IBatchRejectedDepositTransIdsArgs {
	transIds: Key[]
}

export interface IExportDepositArgs {
	siteId: number
	startDate: string
	endDate: string
	depositId: null | string
	userName: null | string
	selectBankCode: number[]
	selectCalCode: number[]
	selectPayId: number[]
	startAmount: number
	endAmount: number
	depositTypes: number[]
	statuses: number[]
	currencyIds: number[]
	levelStatuses: number[]
	agent: string
}

export interface IDepositRequestFrom {
	amount: number
	bankId: number
	comment: string
	statementTime: Moment
}

export interface IDepositCommentData {
	comment: null | string
	createTime: string
	action: number
	actionName: string
	actionString: string
	actualDeposit: number
	operator: string
}

export interface ISetDepositStatusArgs {
	action: number
	actualDeposit: number
	comment: null | string
	transId: string
	// * statementTime、bankId 只有在 action 是 draft 時才需要送出
	statementTime?: string
	bankId?: number
}

export interface ISetAmountByTransIdArgs {
	siteId: number
	currencyId: number
	transId: string
	before: {
		amount: number
	}
	after: {
		amount: number
	}
}

export interface IDepositReasonMessage {
	name: string
	value: number
}

export interface ISendDepositReasonMessageArgs {
	siteId: number
	currencyId: number
	transId: string
	action: number
	actualDeposit: number
	after: { depositId: number; status: number }
}
