import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export interface ICustIdInterface {
	custId: number
}

// Sider 用戶資訊
export interface IGetBasicInfoArgs {
	custId: number
}

export interface ITagData {
	id: number
	tagName: string
	description: string
	tagColour: string
}

export interface ICustLineProfile {
	custId: number
	userId: string
	createTime: string
}

export interface IGetBasicInfoData {
	custId: number
	vipLevel: number
	vipLogo: string
	isOnline: boolean
	userName: string
	accountName: string
	phoneVerified: boolean
	emailVerified: boolean
	actStatus: number
	isLineBinding: boolean
	custLineProfile: ICustLineProfile
	status: number
	enableRebate: number
	depositPointLevel: number
	currency: string
	identity: number
	affiliatesName: string
	affiliatesCode: string
	registeredTime: string
	firstDepositTime: string
	lastLoginTime: string
	lastActiveTime: string
	birthDay: string
	birthMonth:
		| '1'
		| '2'
		| '3'
		| '4'
		| '5'
		| '6'
		| '7'
		| '8'
		| '9'
		| '10'
		| '11'
		| '12'
	birthYear: string
	email: string
	mobileNumber: string
	address: string
	isRisk: boolean
	isKyc: boolean
	isTest: boolean
	tagList: ITagData[]
}

export type IGetBasicInfoResponse = IAxiosResponse<IGetBasicInfoData>

// sider 照片刪除
export interface IDeleteCustPhotoIdArgs {
	custId: number
	id: number
}

// 取得 sider 的 custPhoto
export type IGetCustPhotoIdArgs = IGetBasicInfoArgs

export interface IGetCustPhotoData {
	id: number
	photoUrl: string
}

export type IGetCustPhotoResponse = IAxiosResponse<IGetCustPhotoData[]>

// vipLevelLog Log 頁
export interface IGetVipLevelLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
}

export interface IGetVipLevelLogData {
	oldLevel: number
	newLevel: number
	memo: string
	updateTime: string
	updaters: string
}

export type IGetVipLevelLogResponse = IAxiosResponse<IGetVipLevelLogData[]>

// Referral History 頁面
export type IGetReferralHistoryArgs = IGetVipLevelLogArgs

export interface IGetReferralHistoryData {
	custId: number
	userName: string
	currencyId: number
	currency: string
	registerDate: string
	totalDeposit: number
	depositC: number
	totalBet: number
	validBetC: number
	bonusAmount: number
	referralFreeCredit: number
	rewardTime: string
	status: number
	statusName: string
}

export type IGetReferralHistoryResponse = IAxiosResponse<
	IGetReferralHistoryData[]
>

// Notes 頁面
export type IGetCustNotesArgs = IGetVipLevelLogArgs

export interface IGetCustNotesData {
	id: number
	custId: number
	note: string
	createTime: string
	updateTime: string
	operator: string
}

export type IGetCustNotesResponse = IAxiosResponse<IGetCustNotesData[]>

export interface IAddCustNoteArgs {
	siteId?: number
	custId: number
	note: string
}

export interface ISetCustNoteArgs {
	siteId?: number
	custId: number
	type: number
	noteId: number
	note: string
}
export interface ITodayInfoData {
	todayDeposit: number
	todayWithdrawal: number
	todayWinLoss: number
	todayBetting: number
}

export interface ICustTpWalletList {
	tpId: number
	tpName: string
	tpUserName: string
	balance: number
	walletType: number
}

export interface ICustTpWalletData {
	totalTpWalletBalance: number
	tpWalletList: ICustTpWalletList[]
}

export interface IBonusWalletInfoData {
	promotionCategory: string
	bonusCode: string
	bonus: number // * Bonus Wallet
	remainingTurnover: number // * Bonus Rollover
}

export interface ICustRebateCategoryData {
	categoryId: number
	categoryName: string
	rebateAmountSum: number
}

export interface ICustRewardTypeData {
	typeId: number
	typeName: string
	rewardAmountSum: number
}

export interface IBonusWalletDetailData {
	custBonusSum: {
		cancelBonusAmount: number
		rewardPoint: number
		totalBonus: number
	}
	custRebateSum: {
		custRebateCategory: ICustRebateCategoryData[]
		custRebateTotalSum: number
	}
	custRewardSum: {
		custRewardType: ICustRewardTypeData[]
		custRewardTotalSum: number
	}
}

export interface IWalletBalanceInfoData {
	balance: number
	remainingTurnOver: number
	eligibleWithdrawal: number
	depositSum: number
	withdrawlSum: number
	paymentFee: number
	totalAdjustment: number
}

export interface IWinLossInfoData {
	winnings: number
	losses: number
	validBet: number
	outstandingAmount: number
	winLoss: number
}

export interface IWinLossSummaryData {
	winlostAmount: number
	categoryId: number
	name: string
}

export interface IGetIpCountData {
	loginIp: string
	userCount: number
}

export interface IGetDeviceData {
	deviceId: string
	risk: string
	frequency: number
	associateCount: number
	lastUpdateTime: string
	score: number
	deviceType: string
}

export interface IGetFinancialLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
	financialType: number
}

export interface IFinancialLogData {
	id: number
	createTime: string
	type: number
	typeName: string
	direction: number
	changeAmount: number
	beforeAmount: number
	afterAmount: number
	refTransId: string
	memo: string
	financialType: number
}

export type IFinancialLogsResponse = IAxiosResponse<IFinancialLogData[]>

export enum SettingEditTypeEnum {
	FullName = 'FullName',
	Email = 'Email',
	PhoneNo = 'PhoneNo',
	Birthday = 'Birthday',
	Address = 'Address',
	LockAccount = 'LockAccount',
	CloseAccount = 'CloseAccount',
	KickOutUser = 'KickOutUser',
}

export enum SettingSwitchTypeEnum {
	IsKyc = 'IsKyc',
	Risk = 'Risk',
	PhoneVerified = 'PhoneVerified',
	EmailVerified = 'EmailVerified',
	RebatePayout = 'RebatePayout',
}

export interface ISettingForm {
	fullName: string
	email: string
	phoneNo: string
	birthDay: Moment
	reason: string
	address: {
		country: string
		state: string
		postCode: string
		city: string
		line1: string
		line2: string
	}
}

export enum PayoutVerificationRewardOTPTypeEnum {
	Phone = 0,
	Email = 1,
}

export interface VIPLevelSettingEnumData {
	level: number
	levelName: string
}

export interface VIPLevelInfoByCustIdData {
	vipLevel: string
	manually: number
	qualifiedTime: string
}

export type VIPLevelInfoByCustIdResponse =
	IAxiosResponse<VIPLevelInfoByCustIdData>

export interface VIPLevelLogByCustData {
	oldLevel: string
	newLevel: string
	memo: string
	updateTime: string
	updaters: string
}
// LoginLog 頁面
export interface IGetLoginLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
}

export interface IGetLoginLogData {
	id: number
	loginTime: string
	loginIp: string
	fromUrl: string
	userAgent: string
	location: string
}

export type IGetLoginLogResponse = IAxiosResponse<IGetLoginLogData[]>

// SMSInfo 頁面
export type IGetSMSInfoArgs = IGetVipLevelLogArgs

export interface IGetSMSInfoData {
	isPopup: boolean
	popupMessage: string
	title: string
	content: string
	id: number
	type: number
	siteId: number
	langId: string
	recipient: string
	sender: string
	createTime: string
	status: number
	flag: boolean
	contentRemoveTag: string
	isBatch: boolean
}

export type IGetSmsInfoResponse = IAxiosResponse<IGetSMSInfoData[]>

export interface ISendPersonalMsgArgs {
	siteId?: number
	custId: number
	title: string
	content: string
}

export interface IDeletePersonalMsgArgs {
	id: number
	isBatch: boolean
}

// IP List 頁面

export interface IGetIpLogArgs {
	custId: number
	startDate: string
	endDate: string
}

export interface IGetIpLogData {
	loginIp: string
	updateOperator: string
	memo: string
	isBlock: boolean
	location: string
	count: number
	loginTime: string
}

export type IGetIpLogResponse = IAxiosResponse<IGetIpLogData[]>

export interface IGetIpUserListArgs {
	ip: string
}

export interface IGetIpUserListData {
	custId: number
	userName: string
}

export type IGetIpUserListResponse = IAxiosResponse<IGetIpUserListData[]>

// Marketing => Bonus Log
export interface IGetBonusLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
	promoCategoryId: number
	refTransId: string
}

export interface IGetBonusLogData {
	id: number
	bonusId: number
	createTime: string
	typeName: string
	direction: number
	changeBonus: number
	beforeBonus: number
	afterBonus: number
	refTransId: string
	memo: string
}

export type IGetBonusLogResponse = IAxiosResponse<IGetBonusLogData[]>

// Marketing => VipRebateLog 頁面

export type IGetVipRebateLogArgs = IGetLoginLogArgs

export interface IGetVipRebateLogData {
	siteId: number
	siteName: string
	custId: number
	userName: string
	currencyId: number
	currency: string
	categoryId: number
	categoryName: string
	rcRedeemAmount: number
	createTime: string
	refId: string
	settledDate: number
}

// Marketing => RewardPointLog 頁面

export interface IGetRewardPointLogArgs {
	custId: number
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export interface IGetRewardPointLogData {
	pointType: number
	typeName: string
	refTransId: string
	changePoint: number
	beforePoint: number
	afterPoint: number
	memo: string
	operator: string
	createTime: string
}

export type IGetRewardPointLogResponse = IAxiosResponse<
	IGetRewardPointLogData[]
>

// Marketing => PromotionReport
export interface IGetPromotionReportArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
}

export type ICustRollOverType = {
	rollOver: number
	winOver: number
	turnOver: number
}
export interface IGetPromotionReportData {
	bonusId: number
	bonusCode: string
	description: string
	promotionType: number
	categoryId: number
	categoryName: string
	expiryDays: number
	periodTo: number
	currencyId: number
	rollOver: number
	fullFillType: number
	bonus: number
	bonusType: number
	maxBonus: number
	lockedAmount: number
	bonusAmount: number
	expiryTime: string
	bonusInfoStatus: number
	sort: number
	custRollOver: ICustRollOverType
	claimDate: string
	updateTime: string
	atPage: number
	cancelBonusAmount: number
	expiredCancel: boolean
	depositInfo: string
}

// Promotion Report Cancel
export interface ICancelBonusArgs {
	siteId?: number
	custId: number
	bonusId: number
	currencyId: number
}

export type DepositInfoType = Array<{ Amount: number; DepositId: string }>

export type IGetPromotionReportResponse = IAxiosResponse<
	IGetPromotionReportData[]
>

// 取得 DeviceList 關聯帳號
export interface IGetDeviceUserListArgs {
	custId: number
	deviceId: string
}

// deposit info 頁面

export interface IGetDepositInfoArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
	status: number
}

export interface IGetDepositInfoData {
	accountName: string
	accountNo: string
	actualDeposit: number
	amount: number
	bankName: string
	createTime: string
	depositTime: string
	depositType: number
	refId: string
	status: number
	transId: string
	updateTime: string
}

export type IGetDepositInfoResponse = IAxiosResponse<IGetDepositInfoData[]>

// withdrawal info 頁面
export interface IGetWithdrawalInfoArgs extends IGetDepositInfoArgs {}

export interface IGetWithdrawalInfoData {
	accountName: string
	accountNo: string
	amount: number
	createTime: string
	withdrawalType: number
	refId: string
	status: number
}

export type IGetWithdrawalInfoResponse = IAxiosResponse<
	IGetWithdrawalInfoData[]
>
