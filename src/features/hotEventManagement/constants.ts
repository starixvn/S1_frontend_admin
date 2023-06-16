export enum StatusEnum {
	Inactive,
	Active,
	All,
}

export const gameIdTypes: {
	id: number
	displayName: string
}[] = [
	{
		id: 1,
		displayName: 'Soccer',
	},
	{
		id: 2,
		displayName: 'Basketball',
	},
]

export const statusList: Array<{ value: number; displayName: string }> = [
	{ value: StatusEnum.All, displayName: 'Label_All' },
	{ value: StatusEnum.Active, displayName: 'Label_Active' },
	{ value: StatusEnum.Inactive, displayName: 'Label_Inactive' },
]

export enum SportLeagueEnum {
	All,
}
