const ADJUSTMENT_TYPE = {
	ADD: 5,
	MINUS: 6,
}

export const adjustmentTypeList: { id: number; displayKey: string }[] = [
	{
		id: ADJUSTMENT_TYPE.ADD,
		displayKey: 'Label_Add',
	},
	{
		id: ADJUSTMENT_TYPE.MINUS,
		displayKey: 'Label_Minus',
	},
]

export const TP_LOG_STATUSES = {
	Success: 0,
	Fail: 1,
	Pending: 2,
	PendingD: 3,
}
