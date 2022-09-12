export enum StatusEnum {
	Inactive,
	Active,
	All,
}

export const statusList: Array<{ value: number; displayName: string }> = [
	{ value: StatusEnum.All, displayName: 'Label_All' },
	{ value: StatusEnum.Active, displayName: 'Label_Active' },
	{ value: StatusEnum.Inactive, displayName: 'Label_Inactive' },
]
