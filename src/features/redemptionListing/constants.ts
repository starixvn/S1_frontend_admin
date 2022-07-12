export enum StatusEnum {
	Draft,
	Pending,
	Approve,
	Rejected,
	OnHold,
}

export const statusesList: Array<{
	status: number
	displayKey: string
}> = [
	{ status: StatusEnum.Draft, displayKey: 'Label_Draft' },
	{ status: StatusEnum.Pending, displayKey: 'Label_Pending' },
	{ status: StatusEnum.Approve, displayKey: 'Label_Approve' },
	{ status: StatusEnum.Rejected, displayKey: 'Label_Cancel' },
	{ status: StatusEnum.OnHold, displayKey: 'Label_OnHold' },
]
