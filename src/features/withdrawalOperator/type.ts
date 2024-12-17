import { Dayjs } from 'dayjs'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { ICurrencyAmountRecordData } from 'features/paymentAdjustment/type'
import { UploadFile } from 'antd/es/upload/interface'

export interface IExportWithdrawalListArgs {
	startDate: string
	endDate: string
	siteId?: number
	startAmount: number
	endAmount: number
	userName: string
	withdrawalId: string | null
	withdrawalMethod: number
	withdrawalTypes: number[]
	statuses: number[]
	currencyIds: number[]
	levelStatuses: number[]
	selectBankCode: number[]
	selectCalCode: number[]
	agentId: number
	dateType: number
}

export interface IGetWithdrawalListArgs extends IExportWithdrawalListArgs {
	pageNumber: number
	pageSize: number
}

export interface IGetWithdrawalData {
	createTime: string
	flowEndTime: string
	isoCode: string
	updateTime: string
	withdrawalId: number
	transId: string
	withdrawalType: number
	withdrawalTypeName: string
	custId: number
	userName: string
	email: string
	withdrawalInfo: string
	currencyId: number
	siteId: number
	amount: number
	chargeFee: number
	memo: string
	comment: string
	status: number
	statusName: string
	siteName: string
	bankName: string
	bankCode: string
	fromBankName: string
	fromBankCode: string
	fromAccountNo: string
	fromAccountName: string
	payName: string
	sysId: number
	payId: number
	bankId: number
	accountNo: string
	accountName: string
	ifscCode: string
	nickName: string
	accountType: string
	network: string
	walletCurrencyID: number
	cryptoCurrency: string
	refId: string
	hasPhotoId: boolean
	vipLevelName: string
	vipLevel: number
	operator: string
	sameOperator: boolean
	calCode: string
	isKyc: number
	isRisk: number
	withdrawlCnt: number
	flag: number
	hasPic: boolean
	bankSlipPicCount: number
	channelName: string
	eWalletName: string
	eWalletSysId: number
	deviceScore: number
	agentId: number
	usableActionButton: number[]
	withdrawalAccountingModels: IWithdrawalAccounting[]
	onUser: string
	processWayName: string
	withdrawalMessageList: { createTime: string; message: string }[]
}

export interface IGetWithdrawalResponse
	extends IAxiosResponse<IGetWithdrawalData[]> {
	currencyAmountRecord: ICurrencyAmountRecordData[]
}

export interface IGetByTransIdArgs {
	transId?: string
}

export interface IWithdrawalCommentData {
	comment: string
	createTime: string
	action: number
	actionName: string
	actionString: string
	actualDeposit: number
	operator: string
}

export type IFilterForm = {
	isAllSite: boolean
	dateRange: [Dayjs, Dayjs]
	userName: string
	currencyIds: number[]
	statuses: number[]
	selectCalCode: number[]
	levelStatuses: number[]
	selectBankCode: number[]
	startAmount: number
	endAmount: number
	withdrawalTypes: number[]
	withdrawalMethod: number
	withdrawalId: string
	agentId: number
	dateType: number
}

export type IWithdrawalAccounting = {
	bankId: number
	amount: number
	chargeFee: number
}

export interface ISetWithdrawalStatusArgs {
	transId: string
	comment: string | null
	action: number
	channelId?: number
	withdrawalInfo?: string
	selId?: number
	withdrawalType?: number
	withdrawalAccountingModels?: IWithdrawalAccounting[] | null
}

export interface IWithdrawalRequestForm {
	comment: string
	withdrawalType: number
	withdrawalAccountingModels: IWithdrawalAccounting[]
	selId: number
	fileList: UploadFile[]
	cryptoWallet: number
	gasFee: number
}

export interface IPayInfo {
	accountNo: string
	loginUrl: string
	loginAccount: string
	loginPassword: string
	transferPin: string
	loginPin: string
	mobilePin?: string
	corporateID?: string
}

export interface IPayInfoWithBankLoginInfo {
	accountNo: string
	loginUrl: string
	transferPin: string
	loginPin: string
	mobilePin?: string
	corporateID?: string
	bankLoginInfo: Array<{ account: string; password: string }>
}

export type IManualOperatorArgs = IGetByTransIdArgs

export interface IUploadPictureArgs {
	pic: string[]
	transId: string
}

export interface IDeletePictureArgs extends IGetByTransIdArgs {
	number: number
}

export interface IWithdrawalReasonMessage {
	name: string
	value: number
}

export interface ISendWithdrawalMessageArgs {
	siteId: number
	currencyId: number
	transId: string
	after: { status: number; withdrawalId: number; action: number }
}

export interface IGetAdjustmentLogArgs {
	startDate: string
	endDate: string
	custId: number
}

export type IAdjustmentLogLimitData = {
	mainType: number
	amount: number
	memo: string
	reasonId: number
	refTransId: string
	creator: string
	createTime: string
}

export interface IAdjustmentWithdrawalData {
	adjustmentWithdrawalLimitLogList: IAdjustmentLogLimitData[]
	totalAmount: number
}

export interface IGetCustomerAssociateBankUserArgs {
	custId: number
}

export interface ICustomerAssociateBankUserData {
	custId: number
	userName: string
	paymentName: string
	associateNo: string
}

export type IReceiveArgs = {
	transId: string
}
