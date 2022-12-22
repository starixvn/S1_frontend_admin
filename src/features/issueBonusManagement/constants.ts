export enum PromotionTypeEnum {
	ReDeposit = 2,
	ManualBonus = 8,
	RetentionFreeBet = 9,
}

export enum BonusTypeEnum {
	Percentage = 1,
	Amount = 2,
}

export enum WalletTypeEnum {
	Seamless = 1,
	Transfer = 2,
}

export enum PayoutTypeEnum {
	BonusPayout = 1,
	BatchBonusPayout,
}

export const payoutTypeList = [
	{ key: PayoutTypeEnum.BonusPayout, displayName: 'Label_BonusPayout' },
	{
		key: PayoutTypeEnum.BatchBonusPayout,
		displayName: 'Label_BatchBonusPayout',
	},
]
