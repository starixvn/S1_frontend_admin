// * 會員狀態 enum
export enum AccountStatusEnum {
	Running = 1,
	Lock = 4,
}

export const accountStatusMap: { [key: number]: string } = {
	[AccountStatusEnum.Running]: 'Label_Running',
	[AccountStatusEnum.Lock]: 'Label_Lock',
}

// * 建單時使用
export const accountStatusList = [
	{
		value: AccountStatusEnum.Running,
		displayName: accountStatusMap[AccountStatusEnum.Running],
	},
	{
		value: AccountStatusEnum.Lock,
		displayName: accountStatusMap[AccountStatusEnum.Lock],
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

// * 批次發送訊息狀態 enum
export enum BatchMessageStatusEnum {
	Pending,
	Finished,
}

// * 列表 status map
export const batchMessageStatusMap: { [key: number]: string } = {
	[BatchMessageStatusEnum.Pending]: 'Label_Pending',
	[BatchMessageStatusEnum.Finished]: 'Label_Finished',
}
