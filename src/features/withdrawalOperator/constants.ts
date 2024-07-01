export enum WithdrawalStatusEnum {
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

export const WITHDRAWAL_STATUS_TAGS_COLOR: { [status: number]: string } = {
	[WithdrawalStatusEnum.Draft]: '#8B8B8B',
	[WithdrawalStatusEnum.Pending]: '#F97C08',
	[WithdrawalStatusEnum.OnHold]: '#F4B30B',
	[WithdrawalStatusEnum.Verify]: '#2DA7EC',
	[WithdrawalStatusEnum.Process]: '#0747A6',
	[WithdrawalStatusEnum.Cancelled]: '#38425B',
	[WithdrawalStatusEnum.Approved]: '#3EA62E',
	[WithdrawalStatusEnum.Rejected]: '#C70707',
	[WithdrawalStatusEnum.ToKyc]: '#9957EC',
}

export enum BonusInfoStatusEnum {
	Initial,
	Running,
	Canceled,
	Expiry,
	FullFill,
	TransferOut,
}

export const BONUS_STATUS: { [status: number]: string } = {
	[BonusInfoStatusEnum.Initial]: 'BonusReportStatuses.Label_Initial',
	[BonusInfoStatusEnum.Running]: 'BonusReportStatuses.Label_Running',
	[BonusInfoStatusEnum.Canceled]: 'BonusReportStatuses.Label_Canceled',
	[BonusInfoStatusEnum.Expiry]: 'BonusReportStatuses.Label_Expiry',
	[BonusInfoStatusEnum.FullFill]: 'BonusReportStatuses.Label_Fulfill',
	[BonusInfoStatusEnum.TransferOut]: 'BonusReportStatuses.Label_TransferOut',
}

// 比對 AccountType
export enum AccountTypeEnum {
	Crypto = 'crypto',
	EWallet = 'ewallet',
}

export enum WithdrawalTypeEnum {
	Undefined = 0,
	OnlinePayment = 1,
	LocalBank = 2,
	EWalletPayment,
	CryptoPay = 4,
	CryptoWallet = 5,
	Settlement = 6,
}

export const WITHDRAWAL_TYPE_NAMES: { [type: number]: string } = {
	[WithdrawalTypeEnum.Undefined]: 'Label_Undefined',
	[WithdrawalTypeEnum.OnlinePayment]: 'Label_OnlinePayment',
	[WithdrawalTypeEnum.EWalletPayment]: 'Label_EWalletPayment',
	[WithdrawalTypeEnum.LocalBank]: 'Label_LocalBanking',
	[WithdrawalTypeEnum.CryptoPay]: 'Label_CryptoPay',
	[WithdrawalTypeEnum.CryptoWallet]: 'Label_CryptoWallet',
	[WithdrawalTypeEnum.Settlement]: 'Label_Settlement',
}

export enum PurposeEnum {
	Deposit = 1,
	Withdrawal,
}

export enum DateTypeEnum {
	CreateTime = 1,
	FlowEndTime,
}

export const DATE_TYPE_OPTIONS = [
	{ displayKey: 'Label_CreateTime', value: DateTypeEnum.CreateTime },
	{ displayKey: 'Label_FlowEndTime', value: DateTypeEnum.FlowEndTime },
]
