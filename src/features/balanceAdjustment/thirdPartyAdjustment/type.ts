import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface ITpBySiteData {
	tpId: number
	tpName: string
}

export type ITpListBySiteResponse = IAxiosResponse<ITpBySiteData[]>

export interface IGetTpListBySiteIdArgs {
	siteId: number | undefined
}

export interface IGetCustInfoWithTpBalanceArgs {
	siteId?: number
	userName: string
	sabaId: string
}

export interface ITpWalletData {
	tpId: number
	tpName: string
	tpUserName: string
	balance: number
	walletType: number
}

export interface ICustInfoWithTpBalanceData {
	tpWalletList: ITpWalletData[]
	siteId: number
	siteName: string
	custId: number
	userName: string
	currencyId: number
	status: number
	balance: number
}

export type ICustInfoWithTpBalanceResponse =
	IAxiosResponse<ICustInfoWithTpBalanceData>

export interface IAdjustmentData {
	id: number
	name: string
}

export type IAdjustmentReasonResponse = IAxiosResponse<IAdjustmentData[]>

enum StatusEnum {
	Success = 0, // * PendingD 狀態成功後就轉為 Success
	Fail,
	Pending, // * 建立單號完成
	PendingD, // * 轉第三方主帳戶扣款成功
}

export interface ITpLogData {
	siteName: string
	userName: string
	operator: string
	remarks: string | null
	category: number
	categoryName: string // * 相當於 table 裡的 AdjustmentReason
	createTime: string
	tpName: string
	transId: string
	direction: number // * ./constants.ts 的 AdjustmentType
	amount: number
	thirdId: number | null
	memo: string
	status: StatusEnum
	tpId: number
	directionName: string
}

export type ITpLogResponse = IAxiosResponse<ITpLogData[]>

export interface IGetTpLogArgs {
	siteId: number
	tpId: number
	userName: string
	custId: number
	pageSize: number
	pageNumber: number
}

export interface ISetTpFundsAdjustmentArgs {
	siteId?: number
	currencyId: number
	custId: number
	tpId: number
	tpName: string
	userName: string
	option: number // * 1: Add, 2: Minus
	amount: number
	memo: string
	reasonId: number
	transId: string // * transId(DepositId)，reasonId=9 才需要帶
}
