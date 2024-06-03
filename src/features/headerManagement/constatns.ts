export enum IconTypeEnum {
	Null,
	New,
}

export const ICON_STATUS_TAGS: {
	[status: number]: { color: string; displayName: string } | null
} = {
	[IconTypeEnum.Null]: null,
	[IconTypeEnum.New]: {
		color: '#3EA62E',
		displayName: 'Label_New',
	},
}

export const IconTypeList = [
	{
		value: IconTypeEnum.Null,
		name: 'Null',
	},
	{
		value: IconTypeEnum.New,
		name: 'New',
	},
] as const
