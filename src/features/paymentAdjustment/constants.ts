export enum AdjustmentTypeEnum {
	Credit = 1,
	Debit = 2,
	IncreaseBonus = 3,
	ReduceBonus = 4,
	ThirdAdd = 5,
	ThirdMinus = 6,
}

export const adjustmentTypeList: { value: number; displayName: string }[] = [
	{ value: AdjustmentTypeEnum.Debit, displayName: 'Label_Debit' },
	{ value: AdjustmentTypeEnum.Credit, displayName: 'Label_Credit' },
	{
		value: AdjustmentTypeEnum.IncreaseBonus,
		displayName: 'Label_IncreaseBonus',
	},
	{ value: AdjustmentTypeEnum.ReduceBonus, displayName: 'Label_ReduceBonus' },
	{ value: AdjustmentTypeEnum.ThirdAdd, displayName: 'Label_ThirdAdd' },
	{ value: AdjustmentTypeEnum.ThirdMinus, displayName: 'Label_ThirdMinus' },
]
