export enum AdjustTypeEnum {
	Default,
	BirthReward,
	SpecialReward,
}

export const adjustTypeList: Array<{
	type: number
	displayKey: string
}> = [
	{ type: AdjustTypeEnum.Default, displayKey: 'Label_Default' },
	{ type: AdjustTypeEnum.BirthReward, displayKey: 'Label_BirthdayReward' },
	{ type: AdjustTypeEnum.SpecialReward, displayKey: 'Label_Approve' },
]
