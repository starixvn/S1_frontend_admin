export enum StatusEnum {
	Running = 1,
	Lock = 4,
}

export const statusList: { [key: number]: string } = {
	[StatusEnum.Running]: 'Label_Running',
	[StatusEnum.Lock]: 'Label_Lock',
}

export const accountStatusList = [
	{
		value: StatusEnum.Running,
		displayName: statusList[StatusEnum.Running],
	},
	{
		value: StatusEnum.Lock,
		displayName: statusList[StatusEnum.Lock],
	},
]

export enum MethodEnum {
	ByUserStatus = 1,
	BatchUpload,
}

export const methodList = [
	{ value: MethodEnum.ByUserStatus, displayName: 'Label_ByUserStatus' },
	{ value: MethodEnum.BatchUpload, displayName: 'Label_BatchUpload' },
]
