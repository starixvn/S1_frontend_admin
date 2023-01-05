export enum VipTypeEnum {
	Upgrade = 1,
	Downgrade,
}

export const vipTypeList = [
	{
		label: 'Label_Upgrade',
		value: VipTypeEnum.Upgrade,
	},
	{
		label: 'Label_Downgrade',
		value: VipTypeEnum.Downgrade,
	},
]

export enum ActionStatusEnum {
	Approved = 1,
	Pending,
	Rejected,
	Settled,
}
