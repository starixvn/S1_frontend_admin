export enum ActStatusEnum {
	// 判斷是否存過錢
	unActive = 1,
	Active,
}

export enum StatusEnum {
	// 帳號狀態
	Running = 1,
	Suspend,
	Closed,
	Lock,
}

export const statusList: Array<{ value: number; displayName: string }> = [
	{
		value: StatusEnum.Running,
		displayName: 'Label_Running',
	},
	{
		value: StatusEnum.Suspend,
		displayName: 'Label_Suspend',
	},
	{
		value: StatusEnum.Closed,
		displayName: 'Label_Closed',
	},
	{
		value: StatusEnum.Lock,
		displayName: 'Label_Lock',
	},
]

export enum IdentityEnum {
	// 用戶是怎麼成為會員的
	Normal, // 直客
	Referral, // 推薦
	Affiliate, // 代理
}

export const identityList: Array<{ value: number; displayName: string }> = [
	{ value: IdentityEnum.Normal, displayName: 'Label_Normal' },
	{ value: IdentityEnum.Referral, displayName: 'Label_Referral' },
	{ value: IdentityEnum.Affiliate, displayName: 'Label_Affiliate' },
]

export enum NotesMethodEnum {
	// Set CustomerNotes 行為 enum
	Update = 1,
	Delete,
}
