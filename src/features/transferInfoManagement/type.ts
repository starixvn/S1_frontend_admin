import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetTransferTypeListData {
	name: string
	value: number
}

export type IGetTransferTypeResponse = IAxiosResponse<
	IGetTransferTypeListData[]
>

export type IGetTransactionTypeResponse = IAxiosResponse<
	IGetTransferTypeListData[]
>

export interface IGetReasonListData {
	reasonId: number
	description: string
}

export type IGetReasonListResponse = IAxiosResponse<IGetReasonListData[]>

export type IGetTransferAccountListArgs = { siteId?: number }

export interface IGetTransferAccountListData {
	currencyId: number
	isoCode: string
	sysId: number
	bankCode: number
	channel: number
	agent: null
	payId: number
	payName: string
	accountNo: string
	accountName: string
	displayName: string
	status: number
}

export type IGetTransferAccountListResponse = IAxiosResponse<
	IGetTransferAccountListData[]
>

export interface IExportBankTransferListArgs {
	siteId?: number
	startTime: string
	endTime: string
	fromCurrencyId: number | null
	toCurrencyId: number | null
	transferTypes: number[]
	fromAccountNo: string | null
	toAccountNo: string | null
	fromChannel: number | null
	toChannel: number | null
	reason: number | null
	fromAgent: string | null
	toAgent: string | null
}

export interface IGetBankTransferListArgs extends IExportBankTransferListArgs {
	pageNumber: number
	pageSize: number
}

export interface IGetBankTransferData {
	transferId: string
	transactionType: number
	transferType: number
	transDate: string
	fromChannel: number
	fromAgent: string
	fromPayId: string
	fromPayName: string
	fromSiteId: number
	fromSiteName: string
	fromCustId: string
	fromUserName: string
	fromCurrencyId: number
	fromIsoCode: string
	fromSysId: number
	fromBankCode: string
	fromAccountNo: string
	fromAccountDisplayName: string
	fromAmount: number
	fromFee: number
	toChannel: number
	toAgent: string
	toPayId: string
	toPayName: string
	toSiteId: number
	toSiteName: string
	toCustId: string
	toUserName: string
	toCurrencyId: number
	toIsoCode: string
	toSysId: number
	toBankCode: string
	toAccountNo: string
	toAccountDisplayName: string
	toAmount: number
	toFee: number
	reason: number
	remark: string
	createTime: string
	creator: number
	creatorName: string
	updateTime: string
	updator: number
	updatorName: string
	receiptUrl: string
}

export type IGetByTransferIdResponse = IAxiosResponse<IGetBankTransferData>
export type IGetBankTransferListResponse = IAxiosResponse<
	IGetBankTransferData[]
>

export interface IGetByTransferIdArgs {
	transferId: string
}

export type IDeleteBankTransferArgs = IGetByTransferIdArgs

export interface IGetBankInfoData {
	sysId: number
	currencyId: number
	bankCode: string
	bankName: string
	bankLogo: string
	bankSite: string
}

export type IGetBankInfoResponse = IAxiosResponse<IGetBankInfoData[]>
