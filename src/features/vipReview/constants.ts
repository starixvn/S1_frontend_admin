export const vipTypeList = [
	{
		label: 'Label_Upgrade',
		value: 1,
	},
	{
		label: 'Label_Downgrade',
		value: 2,
	},
]

export enum VipTypeEnum {
	Upgrade = 1,
	Downgrade,
}

export enum ActionStatusEnum {
	Approved = 1,
	Pending,
	Rejected,
	Settled,
}
