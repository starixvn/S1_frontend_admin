export enum StatueEnum {
	All = 0,
	Running,
	Suspend,
	Closed,
	Lock,
}

export const STATUS_ENUM_OPTIONS: { value: number; displayKey: string }[] = [
	{
		value: StatueEnum.Running,
		displayKey: 'Label_Running',
	},
	{
		value: StatueEnum.Suspend,
		displayKey: 'Label_Suspend',
	},
	{
		value: StatueEnum.Lock,
		displayKey: 'Label_Lock',
	},
	{
		value: StatueEnum.Closed,
		displayKey: 'Label_Close',
	},
]

export enum IdentityEnum {
	All = 0,
	Normal,
	Referral,
	Affiliate,
}

export const IDENTITY_ENUM_OPTIONS: { value: number; displayKey: string }[] = [
	{
		value: IdentityEnum.All,
		displayKey: 'Label_SelectAll',
	},
	{
		value: IdentityEnum.Normal,
		displayKey: 'Label_Normal',
	},
	{
		value: IdentityEnum.Referral,
		displayKey: 'Label_Referral',
	},
	{
		value: IdentityEnum.Affiliate,
		displayKey: 'Label_Affiliate',
	},
]

export enum ShieldLevelEnum {
	All = 0,
	HighRisk,
	LowRisk,
}

export const SHIELD_LEVEL_ENUM_OPTIONS: {
	value: number
	displayKey: string
}[] = [
	{
		value: ShieldLevelEnum.All,
		displayKey: 'Label_SelectAll',
	},
	{
		value: ShieldLevelEnum.HighRisk,
		displayKey: 'Label_HighRisk',
	},
	{
		value: ShieldLevelEnum.LowRisk,
		displayKey: 'Label_LowRisk',
	},
]

export enum IovationLevelEnum {
	All = 0,
	D,
	R,
	A,
}

export const IOVATION_LEVEL_ENUM_OPTIONS: {
	value: number
	name: string
}[] = [
	{
		value: IovationLevelEnum.D,
		name: 'Deny',
	},
	{
		value: IovationLevelEnum.R,
		name: 'Review',
	},
	{
		value: IovationLevelEnum.A,
		name: 'Allow',
	},
]

export enum DateTypeEnum {
	All = 0,
	RegisterDate,
	StatusUpdateDate,
	TagUpdateDate,
}

export const DATE_TYPE_ENUM_OPTIONS: {
	value: number
	displayKey: string
}[] = [
	{
		value: DateTypeEnum.All,
		displayKey: 'Label_SelectAll',
	},
	{
		value: DateTypeEnum.RegisterDate,
		displayKey: 'Label_RegisterDate',
	},
	{
		value: DateTypeEnum.StatusUpdateDate,
		displayKey: 'Label_Status',
	},
	{
		value: DateTypeEnum.TagUpdateDate,
		displayKey: 'Label_Tag',
	},
]

export enum UserTypeEnum {
	All = 0,
	Normal,
	Affiliate,
	LiveStreaming,
}

export const USER_TYPE_ENUM_OPTIONS: {
	value: number
	displayKey: string
}[] = [
	{
		value: UserTypeEnum.All,
		displayKey: 'Label_SelectAll',
	},
	{
		value: UserTypeEnum.Normal,
		displayKey: 'Label_Normal',
	},
	{
		value: UserTypeEnum.Affiliate,
		displayKey: 'Label_Affiliate',
	},
	{
		value: UserTypeEnum.Affiliate,
		displayKey: 'Label_Affiliate',
	},
	{
		value: UserTypeEnum.LiveStreaming,
		displayKey: 'Label_LiveStreaming',
	},
]
