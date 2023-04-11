export enum CompareDateEnum {
	PreviousPeriod,
	SamePeriodLastYear,
}

export const compareDateList = [
	{
		value: CompareDateEnum.PreviousPeriod,
		displayName: 'Label_PreviousPeriod',
	},
	{
		value: CompareDateEnum.SamePeriodLastYear,
		displayName: 'Label_SamePeriodLastYear',
	},
]
