export enum GroupByEnum {
	BonusCode,
	Date,
	Month = 2,
}

export const groupByList = [
	{ value: GroupByEnum.BonusCode, displayName: 'Label_BonusCode' },
	{ value: GroupByEnum.Date, displayName: 'Label_Date' },
	{ value: GroupByEnum.Month, displayName: 'Label_Month' },
]
