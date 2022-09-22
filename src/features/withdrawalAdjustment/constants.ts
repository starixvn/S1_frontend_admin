export enum AdjustmentTypeEnum {
	Default,
	Debit,
	Credit,
}

export const adjustmentTypeList: Array<{ value: number; displayName: string }> =
	[
		{ value: AdjustmentTypeEnum.Default, displayName: 'Label_None' },
		{ value: AdjustmentTypeEnum.Debit, displayName: 'Label_Debit' },
		{ value: AdjustmentTypeEnum.Credit, displayName: 'Label_Credit' },
	]
