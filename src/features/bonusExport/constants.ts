export enum EventTypesEnum {
	Bonus = 1,
	VipRebate,
	VipUpgrade,
	VerificationReward,
	ReferralReward,
	ReferralFreeCredit,
	DrawPrizesReport,
}

type ListType = {
	value: number | string
	displayKey: string
}
export const eventTypesList: Array<ListType> = [
	{ value: EventTypesEnum.Bonus, displayKey: 'Label_Bonus' },
	{ value: EventTypesEnum.VipRebate, displayKey: 'Label_VipRebate' },
	{ value: EventTypesEnum.VipUpgrade, displayKey: 'Label_VipUpgrade' },
	{
		value: EventTypesEnum.VerificationReward,
		displayKey: 'Label_VerificationReward',
	},
	{
		value: EventTypesEnum.ReferralReward,
		displayKey: 'Label_ReferralReward',
	},
	{
		value: EventTypesEnum.ReferralFreeCredit,
		displayKey: 'Label_ReferralFreeCredit',
	},
	{
		value: EventTypesEnum.DrawPrizesReport,
		displayKey: 'Label_DrawPrizesReport',
	},
]

export const verificationRewardEventNames: Array<ListType> = [
	{ value: 'phone', displayKey: 'Label_Phone' },
	{ value: 'email', displayKey: 'Label_Email' },
]
