export enum VipTypeEnum {
	Upgrade = 1,
	Downgrade,
}

export const vipTypeList = [
	{
		displayKey: 'Label_Upgrade',
		value: VipTypeEnum.Upgrade,
	},
	{
		displayKey: 'Label_Downgrade',
		value: VipTypeEnum.Downgrade,
	},
]

export enum ActionStatusEnum {
	Pending = 1,
	Approved,
	Rejected,
	Settled,
}
