import { DepositStatusEnum, VipLevelEnum } from 'features/depositOperator/type'

export const DEPOSIT_STATUS_TAGS_COLOR: { [status: number]: string } = {
	[DepositStatusEnum.Draft]: '#8B8B8B',
	[DepositStatusEnum.Pending]: '#F97C08',
	[DepositStatusEnum.OnHold]: '#F4B30B',
	[DepositStatusEnum.Canceled]: '#38425B',
	[DepositStatusEnum.Approved]: '#3EA62E',
	[DepositStatusEnum.Rejected]: '#C70707',
}

export const VIP_LEVELS_COLOR: { [level: number]: string } = {
	[VipLevelEnum.VintageClub]: '#C6842C',
	[VipLevelEnum.SilverClub]: '#C0C0C0',
	[VipLevelEnum.GoldClub]: '#FFD700',
	[VipLevelEnum.TitaniumClub]: '#66CDAA',
	[VipLevelEnum.DiamondClub]: '#4169E1',
	[VipLevelEnum.NovaClub]: '#B22222',
}

export enum ActStatusEnum {
	// 判斷是否存過錢
	unActive = 1,
	Active,
}

// DeviceList Allow 欄位
export enum DeviceListAllowEnum {
	Allow = 'A',
	Deny = 'D',
	Review = 'R',
}

export const DEVICE_ALLOW_STATUS_DISPLAY_KEYS: { [key: string]: string } = {
	[DeviceListAllowEnum.Allow]: 'Label_Allow',
	[DeviceListAllowEnum.Deny]: 'Label_Deny',
	[DeviceListAllowEnum.Review]: 'Label_Review',
}

export enum DateTypeEnum {
	StatementTime,
	CreateTime,
}

export const DATE_TYPE_OPTIONS = [
	{ displayKey: 'Label_CreateTime', value: DateTypeEnum.CreateTime },
	{ displayKey: 'Label_StatementTime', value: DateTypeEnum.StatementTime },
]
