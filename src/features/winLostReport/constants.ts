export enum DateTypeEnum {
	SettledDate = 1,
	CreatedDate,
}

export const dateTypeList: Array<{
	value: number
	displayName: string
}> = [
	{ displayName: 'Label_SettledDate', value: DateTypeEnum.SettledDate },
	{ displayName: 'Label_CreatedDate', value: DateTypeEnum.CreatedDate },
]

export enum GroupByEnum {
	Date = 1,
	Month,
	Product,
	Category,
	Currency,
	Player,
	Brand,
	Affiliate,
}

export const groupByList: Array<{ value: number; displayName: string }> = [
	{ displayName: 'Label_Date', value: GroupByEnum.Date },
	{ displayName: 'Label_Month', value: GroupByEnum.Month },
	{ displayName: 'Label_Product', value: GroupByEnum.Product },
	{ displayName: 'Label_Category', value: GroupByEnum.Category },
	{ displayName: 'Label_Currency', value: GroupByEnum.Currency },
	{ displayName: 'Label_Player', value: GroupByEnum.Player },
	{ displayName: 'Label_Brand', value: GroupByEnum.Brand },
	{ displayName: 'Label_Affiliate', value: GroupByEnum.Affiliate },
]

export enum OrderEnum {
	ascend = 0,
	descend = 1,
}

export const groupName: { [groupBy: number]: string } = {
	[GroupByEnum.Date]: 'Date',
	[GroupByEnum.Month]: 'Date',
	[GroupByEnum.Product]: 'TpGameTypeName',
	[GroupByEnum.Category]: 'TpCategoryName',
	[GroupByEnum.Currency]: 'Currency',
	[GroupByEnum.Player]: 'UserName',
	[GroupByEnum.Brand]: 'Site',
	[GroupByEnum.Affiliate]: 'UserName',
}

export const i18nKeyInfo: { [i18nKey: string]: string } = {
	SabaId: 'Label_SabaId',
	UserName: 'Label_UserName',
	TurnOver: 'Label_TurnOver',
	ValidTurnOver: 'Label_ValidTurnover',
	Ggr: 'Label_GGR',
	PlayerWinLoss: 'Label_PlayerWinLoss',
	BaPlayerWinLoss: 'Label_BaPlayerWinLoss',
	ProgressiveWin: 'Label_ProgressiveWin',
	ProgressiveBet: 'Label_ProgressiveBet',
	Commission: 'Label_Commission',
	BaCommission: 'Label_BaCommission',
	BetCount: 'Label_BetCount',
	AvgBetAmount: 'Label_AvgBetAmount',
	UniquePlayers: 'Label_UniquePlayers',
	Margin: 'Label_Margin',
	ClosingBalance: 'Label_ClosingBalance',
	DepositCount: 'Label_DepositCount',
	TotalDepositAmount: 'Label_TotalDepositAmount',
	WithDrawCount: 'Label_WithdrawalCount',
	TotalWithDrawAmount: 'Label_TotalWithdrawalCount',
	TotalBonus: 'Label_TotalBonus',
}
