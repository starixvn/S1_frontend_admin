import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'
import { PermissionInterface } from 'type'
import moment from 'moment/moment'
import { IdentityEnum } from 'features/memberAdministrationList/constants'

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

export interface IAffInfo {
	identity?: IdentityEnum
	tagList?: ITagData[]
	id?: number
	tagName?: string
	description?: string
	tagColour?: string
	custLineProfile?: object
	custId?: number
	userId?: string
	createTime?: string
	enableRebate?: boolean
	affInfo?: object
	affiliateCode: string
	affiliateName: string
	revenueName: string
	revenueShare?: number
	totalEarning: number
	totalPlayers: number
}

export interface IGetBasicInfoData {
	custId: number
	vipLevel: number
	levelName: string
	vipLogo: string
	isOnline: boolean
	userName: string
	accountName: string
	phoneVerified: boolean
	emailVerified: boolean
	actStatus: number
	isLineBinding: boolean
	custLineProfile: ICustLineProfile
	status: LockAccountTypeEnum
	enableRebate: number
	depositPointLevel: number
	currency: string
	identity: IdentityEnum
	agentName: string
	superiorAffiliateCode: string
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
	// * affInfo 參數代理會員才會有值，一般會員 affInfo 為 null 的
	affInfo: null | IAffInfo
	phoneRewardTime: string
	emailRewardTime: string
	userLang: string
	phoneVerifyTime: string
	emailVerifyTime: string
	exclusive: number
	sabaId: string
	memberType: number
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
	canEdit: boolean
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
	todayBonus: number
	todayReward: number
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
	description: string
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
		cashBack: number
		firstDeposit: number
		freeBet: number
		manualBonus: number
		reDeposit: number
		retentionBonus: number
		rewardPoint: number
		totalBonus: number
		deviceBonus: number
	} | null
	custRebateSum: {
		custRebateCategory: ICustRebateCategoryData[]
		custRebateTotalSum: number
	} | null
	custRewardSum: {
		custRewardType: ICustRewardTypeData[]
		custRewardTotalSum: number
	} | null
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
	refTransId: string
	financialTypeList: number[]
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
	UnLockAccount = 'UnLockAccount',
	CloseAccount = 'CloseAccount',
	KickOutUser = 'KickOutUser',
}

export enum LockAccountTypeEnum {
	Running = 1,
	Suspend,
	Closed,
	Locked,
}

export enum SettingSwitchTypeEnum {
	IsKyc = 'IsKyc',
	Risk = 'Risk',
	PhoneVerified = 'PhoneVerified',
	EmailVerified = 'EmailVerified',
	RebatePayout = 'RebatePayout',
	ExclusiveVIP = 'ExclusiveVIP',
}

export enum SettingCustPromotionWitheListEnum {
	ipEnable = 'ipEnable',
	deviceEnable = 'deviceEnable',
	realNameEnable = 'realNameEnable',
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
	isPopup: boolean
	popupMessage: string
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

// Marketing => Setting 頁面 裡的 Marketing

export interface IGetCustPromotionWhiteListArgs {
	custId: number
}

export interface ICustPromotionWhiteData {
	custId: number
	siteId: number
	userName: string
	ipEnable: boolean
	deviceEnable: boolean
	realNameEnable: boolean
	operator: string
}

export type ICustPromotionWhiteResponse =
	IAxiosResponse<ICustPromotionWhiteData>

export interface IEditCustPromotionWhiteArgs {
	custId: number
	ipEnable: boolean
	deviceEnable: boolean
	realNameEnable: boolean
}

// Marketing => Bonus Log
export interface IGetBonusLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
	promoCategoryIds: number[]
	refTransId: string | null
}

export type IBonusLogFilterForm = {
	dateRange: [moment.Moment, moment.Moment]
	promoCategoryIds: number[]
	refTransId: string
}

export interface IGetBonusLogData {
	id: number
	bonusId: number
	createTime: string
	bonusCode: string
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

export interface IGetVipRebateLogArgs extends IGetLoginLogArgs {
	payoutStatuses: number[]
}

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
	maxPayout: number
	minPayout: number
	rcCalculatedAmount: number
}

export interface IGetVipRebateDetailArgs {
	custId: number
	tpCategoryId: number
	refId: string
}

export interface IGetVipRebateDetailData {
	gameType?: number
	typeName: string
	validBet: number
	percentage: number | null
	calculatedAmount: number
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

// Marketing => PromotionFailLog

export interface IGetPromotionReceiveFailLogArgs {
	custId: number
	startTime: string
	endTime: string
}

export interface IPromotionReceiveFailLogData {
	bonusCode: string
	promotionTypeName: string
	createTime: string
	errorCode: string
	errorReason: string
	siteId: number
	custId: number
	currencyId: number
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

// GameLog => 3RDParty
export interface IGetThirdPartyAccountData {
	tpName: string
	tpUserName: string
}

// GameLog => WinLossSummary
export interface IGetGameTypeListArgs {
	tpCategoryList: number[]
}

export interface IGetGameTypeListData {
	type: number
	typeName: string
	tpId: number
	categoryId: number
}

export interface IGetWinLossSummaryDetailArgs {
	custId: number
	gameTypes: number[]
}

export interface IGetWinLossSummaryDetailData {
	tpUserName: string
	winlostAmount: number
	stakeSettled: number
	stakeNotRollover: number
	gameType: number
	gameName: string
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
	bonusDescription: string
	flowEndTime: string | null
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

// adjustment info 頁面
export interface IGetAdjustmentInfoArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
	adjustType: number
}

export interface IGetAdjustmentInfoData {
	transId: string
	adjustType: number
	currencyId: number
	siteId: number
	amount: number
	createTime: string
	status: number
	custId: number
	memo: string
	isTest: number
	category: number
}

export type IGetAdjustmentInfoResponse = IAxiosResponse<
	IGetAdjustmentInfoData[]
>

// thirdParty adjustment info 頁面
export interface IGetTpAdjustmentLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startTime: string
	endTime: string
	tpId: number
	direction: number
}

export interface IGetTpAdjustmentLogData {
	siteName: string
	userName: string
	operator: string
	remarks: string
	category: number
	categoryName: string
	depositId: null
	createTime: string
	tpName: string
	transId: string
	direction: number
	amount: number
	memo: string
	status: number
	tpId: number
	directionName: string
}

export type IGetTpAdjustmentLogResponse = IAxiosResponse<
	IGetTpAdjustmentLogData[]
>

// withdrawalLimit log 頁面
export interface IGetWithdrawalLimitLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
}

export interface IGetWithdrawalLimitLogData {
	mainType: number
	changeWithdrawalLimit: number
	beforeWithdrawalLimit: number
	afterWithdrawalLimit: number
	memo: string
	refTransId: string
	createTime: string
}

export type IGetWithdrawalLimitLogResponse = IAxiosResponse<
	IGetWithdrawalLimitLogData[]
>

// transfer info 頁面
export interface IGetTransferInfoArgs extends IGetWithdrawalLimitLogArgs {}

export interface IGetTransferInfoData {
	createTime: string
	tpName: string
	transId: string
	direction: number
	amount: number
	thirdId: string
	memo: string
	status: number
	tpId: number
	directionName: string
}

export type IGetTransferInfoResponse = IAxiosResponse<IGetTransferInfoData[]>

// financial Log 頁面
export interface IExportFinancialLogArgs {
	custId: number
	startDate: string
	endDate: string
	refTransId: string
	financialTypeList: number[]
}

// bankInfo Log 頁面
export interface IGetBankInfoArgs {
	pageNumber: number
	pageSize: number
	custId: number
}

export interface IGetBankInfoData {
	accountName: string
	bankName: string
	accountNum: string
	ifscCode: string
	createTime: string
	status: number
}

export type IGetBankInfoResponse = IAxiosResponse<IGetBankInfoData[]>

// eWalletInfo Log 頁面
export interface IGetEWalletInfoArgs extends IGetBankInfoArgs {}

export interface IGetEWalletInfoData {
	accountNum: string
	accountName: string
	eWalletName: string
	createTime: string
	status: number
}

export type IGetEWalletInfoResponse = IAxiosResponse<IGetEWalletInfoData[]>

// crypto log 頁面
export interface IGetCryptoLogArgs extends IGetBankInfoArgs {}

export interface IGetCryptoLogData {
	currencyId: number
	isoCode: string
	netWork: string
	usdtAddress: string
	createTime: string
	status: number
}

export type IGetCryptoLogResponse = IAxiosResponse<IGetCryptoLogData[]>

// bankList 頁面
export interface IGetBankListArgs {
	custId: number
}

export interface IGetBankListData {
	custId: number
	userName: string
	bankName: string
	accountName: string
	accountNum: string
	sysId: number
	ifscCode: string
	createTime: string
	updateTime: string
	blockUpdateTime: string
	updateOperator: string
	status: number
	blockStatus: number
	currencyId: number
}

export type IGetBankListResponse = IAxiosResponse<IGetBankListData[]>

// eWalletList 頁面
export interface IGetEWalletListArgs extends IGetBankListArgs {}

export interface IGetEWalletListData {
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

export type IGetEWalletListResponse = IAxiosResponse<IGetEWalletListData[]>

// GameLog => Turnover
export interface IGetTurnoverArgs extends IGetWinLossSummaryDetailArgs {
	startDate: string
	endDate: string
}

// Turnover Response
// Total TO = stakeSettled + stakeNotRollover,
// Valid Bet = stakeSettled,
// Turnover (ExcludeValidTO) = stakeNotRollover,
// WinLoss = winlostAmount
export interface IGetTurnoverData {
	gameName: string
	stakeSettled: number
	userName: string
	tpUserName: string
	winlostAmount: number
	stakeNotRollover: number
}

// GameLog => Statement

// Table 第一層 , 取得客戶紀錄
export interface IGetCustTpBetRecordArgs extends IGetIpLogArgs {
	gameTypes: number[]
}

export interface IGetCustTpBetRecordData {
	settledDate: string
	totalTO: number
	validBet: number
	invalidBet: number
	turnOver: number
	runningTickets: number
	winLoss: number
	totalTOExcludeBonus: number
	winLossExcludeBonus: number
}

// Table 第二層 , 取得客戶指定日期紀錄
export interface IGetCustTpBetRecordByDayArgs extends IGetCustTpBetRecordArgs {
	selDate: string
}

export interface IGetCustTpBetRecordByDayData {
	settledDate: string
	categoryName: string
	categoryId: number
	totalTO: number
	validBet: number
	invalidBet: number
	turnOver: number
	runningTickets: number
	winLoss: number
	totalTOExcludeBonus: number
	winLossExcludeBonus: number
}

// Table 第三層 , 取得客戶指定 Category 紀錄
export interface IGetCustTpBetRecordByCategoryIdArgs
	extends IGetCustTpBetRecordByDayArgs {
	categoryId: number
}

export interface IGetCustTpBetRecordByCategoryIdData {
	settledDate: string
	gameTypeName: string
	gameTypeID: number
	totalTO: number
	validBet: number
	invalidBet: number
	turnOver: number
	runningTickets: number
	winLoss: number
	totalTOExcludeBonus: number
	winLossExcludeBonus: number
}

// Table 第四層 , 取得客戶指定 GameType 紀錄
export interface IGetCustTpBetRecordByGameTypeArgs
	extends Omit<IGetCustTpBetRecordByDayArgs, 'gameTypes'> {
	pageNumber: number
	pageSize: number
	gameTypeId: number
}

export type IExportCustTpBetRecordByGameTypeArgs = Omit<
	IGetCustTpBetRecordByGameTypeArgs,
	'pageNumber' | 'pageSize'
>

export interface IGetCustTpBetRecordByGameTypeData {
	transId: string
	bonusId: number
	bonusCode: string
	turnOver: number
	validBet: number
	winlostAmount: number
	transTime: string
	settledTime: string
	settlementType: number
	settlementTypeName: string
	turnOver_ExcludeValidTO: number
	validBet_Valid: number
}

// Table 第五層 , 取得第三方細單
export interface IGetTpBetRecordDetailArgs {
	gameType: number
	transId: string
	custId: number
	settledTime: string
}

export type ITpCurrency = {
	tpCurrencyId: string
	exchangeRate: number
}

export type IGetTpBetRecordDetailData = {
	tpId: number
	tpCategoryId: number
	gameType: number
	gameTypeName: string
	transId: string
	detail: string
	detailUrl: string
	tpCurrency: ITpCurrency
	refTransId: string
	tpUserName: string
	utcBetTime: string
	utcSettledTime: string
	stake: number
	winlostAmount: number
	odds: string
	ticketStatus: string
	handicap: string
	leagueName: string
	eventName: string
	selectionName: string
	homeTeamName: string
	homeHandicap: string
	homeyScore: string
	awayTeamName: string
	awayScore: string
	awayHandicap: string
}

// Marketing => CashBack Report
// 取得上方 CashBack Info
export interface IGetPromotionCashBackData {
	bonusCode: string
	description: string
}

// 點 BonusCode 取該 CashBack 輸額細節
export interface IGetPromotionDetailArgs {
	bonusCode: string
	custId: number
}

export type ICashBackDetail = {
	tpName: string
	lossAmount: number // Net Loss
	lossAmountWithBonus: number // Loss With Bonus
}

export interface IGetPromotionDetailData {
	cashBackDetails: {
		totalBonus: number // Total Bonus Claimable
		maxBonus: number // Max Bonus
		totalLossAmount: number // Total Net Loss
		minLossAmount: number // Min Net Loss Required
		originalTotalBonus: number // Total Bonus
		percentage: string // percentage
		cashBackDetail: ICashBackDetail[]
	}
}

export interface ISettingInfoPermissions {
	editFullNamePermission: PermissionInterface | undefined
	editEMailPermission: PermissionInterface | undefined
	editPhoneNumberPermission: PermissionInterface | undefined
	changeVIPLevelPermission: PermissionInterface | undefined
	editBirthdayPermission: PermissionInterface | undefined
	editAddressPermission: PermissionInterface | undefined
	editTagPermission: PermissionInterface | undefined
}

// FullName Log歷史紀錄
export interface IGetCustRealNameChangeLogArgs {
	custId: number
}

export interface ICustRealNameChangeLogData {
	beforeName: string
	afterName: string
	updateTime: string
	operator: string
}

export interface ISettingRiskPermissions {
	isKycPermission: PermissionInterface | undefined
	isRickPermission: PermissionInterface | undefined
	phoneVerifiedPermission: PermissionInterface | undefined
	emailVerifiedPermission: PermissionInterface | undefined
	resetPasswordPermission: PermissionInterface | undefined
	lockAccountPermission: PermissionInterface | undefined
	closeAccountPermission: PermissionInterface | undefined
	kickOutPermission: PermissionInterface | undefined
	resetOtpLimitPermission: PermissionInterface | undefined
}

export interface ISettingFinancePermissions {
	resetBankInfoPermission: PermissionInterface | undefined
	resetEWalletPermission: PermissionInterface | undefined
	resetCryptoInfoPermission: PermissionInterface | undefined
}

export interface ISettingMarketingPermissions {
	phoneVerifiedRewardPermission: PermissionInterface | undefined
	emailVerifiedRewardPermission: PermissionInterface | undefined
	lockRebatePayoutPermission: PermissionInterface | undefined
	exclusiveVipPermission: PermissionInterface | undefined
}

export interface IGetCheckDuplicateNameArgs {
	custId: number
	fullName: string
}

export interface ICheckDuplicateNameData {
	isoCode: string
	custId: number
	userName: string
	accountName: string
}

export type IGetCheckDuplicateNameResponse = IAxiosResponse<
	ICheckDuplicateNameData[]
>

export enum AllDepositStatusEnum {
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

export enum AllWithdrawalStatusEnum {
	Draft,
	Pending,
	OnHold,
	Verify,
	Process,
	Cancelled,
	Approved,
	Rejected,
	ToKyc,
	Error = 99,
}

export interface ISetCustTpGameTypeSettingArgs {
	custId: number
	setDataType: number
	tpGameTypes: number[]
}

export interface IGetCustTpGameTypeSettingArgs {
	custId: number
	getDataTypes: number[]
}

export interface ICustTpGameTypeSettingData {
	noShow: boolean
	noPlay: boolean
	tpId: number
	tpName: string
	gameType: number
	gameTypeName: string
}

export interface IAddLiveStreamingGameData {
	type: number
	typeName: string
	tpId: number
	categoryId: number
	tpName?: string
}

export interface ILiveStreamingGameTableData {
	tpId: number
	tpName: string
	tpGames: IAddLiveStreamingGameData[]
}

export interface ISelectedGameTypes {
	gameTypes: number[]
}

export interface IAddLiveStreamingForm {
	selectedGameTypes: Record<string, ISelectedGameTypes>
	tpId: number[]
}

export type ILiveStreamingInfo = {
	tpId: number
	tpName: string
	selectedGameTypeNames: string[]
}

export type ICustTpGameTypeSettingResponse = IAxiosResponse<
	ICustTpGameTypeSettingData[]
>
