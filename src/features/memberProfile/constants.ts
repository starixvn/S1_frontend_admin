export enum ActStatusEnum {
	// 判斷是否存過錢
	unActive = 1,
	Active,
}

export enum StatusEnum {
	// 帳號狀態
	Running = 1,
	Suspend,
	Closed,
	Lock,
}

export const statusList: Array<{ value: number; displayName: string }> = [
	{
		value: StatusEnum.Running,
		displayName: 'Label_Running',
	},
	{
		value: StatusEnum.Suspend,
		displayName: 'Label_Suspend',
	},
	{
		value: StatusEnum.Closed,
		displayName: 'Label_Closed',
	},
	{
		value: StatusEnum.Lock,
		displayName: 'Label_Lock',
	},
]

export enum AdjustTypeEnum {
	All,
	Debit,
	Credit,
	IncreaseBonus,
	ReduceBonus,
}

export const adjustTypeList: Array<{
	value: number
	displayName: string
}> = [
	{
		value: AdjustTypeEnum.All,
		displayName: 'Label_All',
	},
	{
		value: AdjustTypeEnum.Debit,
		displayName: 'Label_Debit',
	},
	{
		value: AdjustTypeEnum.Credit,
		displayName: 'Label_Credit',
	},
	{
		value: AdjustTypeEnum.IncreaseBonus,
		displayName: 'Label_IncreaseBonus',
	},
	{
		value: AdjustTypeEnum.ReduceBonus,
		displayName: 'Label_ReduceBonus',
	},
]

export enum ThirdPartyAdjustTypeEnum {
	All,
	ThirdAdd,
	ThirdMinus,
}

export const thirdPartyAdjustTypeList: Array<{
	value: number
	displayName: string
}> = [
	{
		value: ThirdPartyAdjustTypeEnum.All,
		displayName: 'Label_All',
	},
	{
		value: ThirdPartyAdjustTypeEnum.ThirdAdd,
		displayName: 'Label_ThirdAdd',
	},
	{
		value: ThirdPartyAdjustTypeEnum.ThirdMinus,
		displayName: 'Label_ThirdMinus',
	},
]

export enum IdentityEnum {
	// 用戶是怎麼成為會員的
	Normal, // 直客
	Referral, // 推薦
	Affiliate, // 代理
}

export const identityList: Array<{ value: number; displayName: string }> = [
	{ value: IdentityEnum.Normal, displayName: 'Label_Normal' },
	{ value: IdentityEnum.Referral, displayName: 'Label_Referral' },
	{ value: IdentityEnum.Affiliate, displayName: 'Label_Affiliate' },
]

export enum NotesMethodEnum {
	// Set CustomerNotes 行為 enum
	Update = 1,
	Delete,
}

export enum FinancialTypeEnum {
	Deposit = 1,
	PaymentAdjustment = 2,
	BonusReward = 5,
	LockedAmount = 6,
	CancelledBonus = 7,
	CashReward = 8,
	Commision = 9,
	BonusTransferIn = 10,
	Rebate = 11,
	CashBack = 12,
	ReferFriendsRewards = 13,
	VIPUpgradeReward = 14,
	AffTransferToPlayer = 15,
	RunningBonus = 16,
	VerificationReward = 20,
	Withdrawl = 1001,
	TpTransfer = 2001,
	TpWager = 11001,
	TpRefunds = 12001,
	TpPayout = 13001,
	TpPrize = 14001,
	TpUndo = 15001,
	TpTip = 16001,
}

export const financialTypeOptions: { value: number; name: string }[] = [
	{
		value: FinancialTypeEnum.Deposit,
		name: 'Deposit',
	},
	{
		value: FinancialTypeEnum.PaymentAdjustment,
		name: 'PaymentAdjustment',
	},
	{
		value: FinancialTypeEnum.BonusReward,
		name: 'BonusReward',
	},
	{
		value: FinancialTypeEnum.LockedAmount,
		name: 'LockedAmount',
	},
	{
		value: FinancialTypeEnum.CancelledBonus,
		name: 'CancelledBonus',
	},
	{
		value: FinancialTypeEnum.CashReward,
		name: 'CashReward',
	},
	{
		value: FinancialTypeEnum.Commision,
		name: 'Commision',
	},
	{
		value: FinancialTypeEnum.BonusTransferIn,
		name: 'BonusTransferIn',
	},
	{
		value: FinancialTypeEnum.Rebate,
		name: 'Rebate',
	},
	{
		value: FinancialTypeEnum.CashBack,
		name: 'CashBack',
	},
	{
		value: FinancialTypeEnum.ReferFriendsRewards,
		name: 'ReferFriendsRewards',
	},
	{
		value: FinancialTypeEnum.VIPUpgradeReward,
		name: 'VIPUpgradeReward',
	},
	{
		value: FinancialTypeEnum.AffTransferToPlayer,
		name: 'AffTransferToPlayer',
	},
	{
		value: FinancialTypeEnum.RunningBonus,
		name: 'RunningBonus',
	},
	{
		value: FinancialTypeEnum.VerificationReward,
		name: 'VerificationReward',
	},
	{
		value: FinancialTypeEnum.Withdrawl,
		name: 'Withdrawl',
	},
	{
		value: FinancialTypeEnum.TpTransfer,
		name: 'TpTransfer',
	},
	{
		value: FinancialTypeEnum.TpWager,
		name: 'TpWager',
	},
	{
		value: FinancialTypeEnum.TpRefunds,
		name: 'TpRefunds',
	},
	{
		value: FinancialTypeEnum.TpPayout,
		name: 'TpPayout',
	},
	{
		value: FinancialTypeEnum.TpPrize,
		name: 'TpPrize',
	},
	{
		value: FinancialTypeEnum.TpUndo,
		name: 'TpUndo',
	},
	{
		value: FinancialTypeEnum.TpTip,
		name: 'TpTip',
	},
]

// BonusLog Page 欄位 Change Bonus 需顯示 正或負
export enum ChangeBonusDirectionEnum {
	Add = 1,
	Minus,
}

// DeviceList Allow 欄位
export enum DeviceListAllowEnum {
	Allow = 'A',
	Deny = 'D',
	Review = 'R',
}

export const deviceStatusList: Array<{ value: string; displayName: string }> = [
	{ value: DeviceListAllowEnum.Allow, displayName: 'Label_Allow' },
	{ value: DeviceListAllowEnum.Deny, displayName: 'Label_Deny' },
	{ value: DeviceListAllowEnum.Review, displayName: 'Label_Review' },
]

// Promotion Report Status Enum
export enum PromotionReportStatusEnum {
	Running = 1,
	Canceled = 2,
	Expiry = 3,
	FullFill = 4,
	TransferOut = 5,
}

export const promotionReportStatusList: Array<{
	value: number
	displayName: string
}> = [
	{
		value: PromotionReportStatusEnum.Running,
		displayName: 'BonusReportStatuses.Label_Running',
	},
	{
		value: PromotionReportStatusEnum.Canceled,
		displayName: 'BonusReportStatuses.Label_Canceled',
	},
	{
		value: PromotionReportStatusEnum.Expiry,
		displayName: 'BonusReportStatuses.Label_Expiry',
	},
	{
		value: PromotionReportStatusEnum.FullFill,
		displayName: 'BonusReportStatuses.Label_Fulfill',
	},
	{
		value: PromotionReportStatusEnum.TransferOut,
		displayName: 'BonusReportStatuses.Label_TransferOut',
	},
]

// Promotion Report FullFillType Enum
export enum PromotionReportFullFillTypeEnum {
	RollOver = 1,
	WinOver = 2,
}

// finance bankList and EWalletList page status Enum
export const BANK_BLOCK_STATUS_VALUE_OPTIONS = {
	ALL: 0,
	BLOCK: 1,
	OPEN: 2,
}

export const BANK_BLOCK_STATUS = [
	{
		displayKey: 'Label_SelectAll',
		value: BANK_BLOCK_STATUS_VALUE_OPTIONS.ALL,
	},
	{
		displayKey: 'Label_Unlock',
		value: BANK_BLOCK_STATUS_VALUE_OPTIONS.OPEN,
	},
	{
		displayKey: 'Label_Block',
		value: BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK,
	},
]

export const RELEASE_STATUS_VALUE_OPTIONS = {
	DELETE: 0,
	OPEN: 1,
	BO_DELETE: 2,
}

// GameLog => Statement Table State
// 用來判斷 Statement 當前顯示的 Table
export enum GameStatementTableEnum {
	TPBetRecord, //  首層
	TPBetRecordByDay, // 二層 , 特定日期
	TPBetRecordByCategory, // 三層 , 特定 category
	TPBetRecordByGameType, // 四層 , 特定 gameType
	TPBetRecordDetail, // 五層 , 特定細單
}

// VipRebate Log isPayout Filter List
export enum IsPayoutEnum {
	false,
	true,
}
export const isPayoutList: Array<{
	value: number
	displayName: string
}> = [
	{ value: IsPayoutEnum.true, displayName: 'Label_Yes' },
	{ value: IsPayoutEnum.false, displayName: 'Label_No' },
]
