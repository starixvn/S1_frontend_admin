export enum StatusEnum {
	All,
	Active,
	InActive,
}

export type ListType = Array<{ value: number; displayName: string }>
export const statusList: ListType = [
	{ value: StatusEnum.All, displayName: 'Label_All' },
	{ value: StatusEnum.Active, displayName: 'Label_Active' },
	{ value: StatusEnum.InActive, displayName: 'Label_InActive' },
]

export enum DevicesEnum {
	All,
	MatchAll,
	Web,
	App,
}

export const devicesList: ListType = [
	{ value: DevicesEnum.All, displayName: 'Label_All' },
	{ value: DevicesEnum.MatchAll, displayName: 'Label_MatchAll' },
	{ value: DevicesEnum.Web, displayName: 'Label_Web' },
	{ value: DevicesEnum.App, displayName: 'Label_App' },
]

export enum WalletTypeEnum {
	All = -1,
	Transfer,
	Seamless,
}

export const walletTypeList: ListType = [
	{ value: WalletTypeEnum.Transfer, displayName: 'Label_Transfer' },
	{ value: WalletTypeEnum.Seamless, displayName: 'Label_Seamless' },
]

// 僅供渲染判斷使用

export enum BonusTypeEnum {
	Null,
	FirstDeposit = 1,
	ReDeposit,
	FreeBet,
	Rebate = 6,
	CashBack = 7,
	ManualBonus,
	RetentionFreeBet,
}

export enum PeriodTypeEnum {
	Daily = 1,
	Weekly,
	Monthly,
	Unlimited,
}

export const periodTypeList: ListType = [
	{ value: PeriodTypeEnum.Daily, displayName: 'Label_Daily' },
	{ value: PeriodTypeEnum.Weekly, displayName: 'Label_Weekly' },
	{ value: PeriodTypeEnum.Monthly, displayName: 'Label_Monthly' },
	{ value: PeriodTypeEnum.Unlimited, displayName: 'Label_Unlimited' },
]

export enum AmountTypeEnum {
	Percentage = 1,
	Amount,
}

export const amountTypeList: ListType = [
	{ value: AmountTypeEnum.Percentage, displayName: 'Label_Percentage' },
	{ value: AmountTypeEnum.Amount, displayName: 'Label_Amount' },
]

export enum ScratchCardStatusEnum {
	All,
	New,
	Used,
}

export const scratchCardStatusList: ListType = [
	{ value: ScratchCardStatusEnum.All, displayName: 'Label_All' },
	{ value: ScratchCardStatusEnum.New, displayName: 'Label_New' },
	{ value: ScratchCardStatusEnum.Used, displayName: 'Label_Used' },
]

export enum PromotionActionEnum {
	Link,
	Detail,
}

export const promotionActionList: ListType = [
	{ value: PromotionActionEnum.Link, displayName: 'Label_Link' },
	{ value: PromotionActionEnum.Detail, displayName: 'Label_Detail' },
]
