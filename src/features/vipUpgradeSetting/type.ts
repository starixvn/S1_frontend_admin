import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetVipUpgradeSupportCurrencyArgs {
	siteId?: number
}

export type IVipUpgradeSupportCurrencyList = number[]

export type IVipUpgradeSupportCurrencyResponse =
	IAxiosResponse<IVipUpgradeSupportCurrencyList>

export interface IGetUpgradeSettingArgs {
	siteId?: number
	currencyId: number
}

interface IUpgradeSettingDetail {
	level: number
	levelValue: string
}

export interface IUpgradeSettingData {
	siteId: number
	currencyId: number
	level: number
	type: number
	typeName: string
	detail: IUpgradeSettingDetail[]
}

export type IGetUpgradeSettingResponse = IAxiosResponse<IUpgradeSettingData[]>

export interface ISetUpgradeSettingArgs {
	siteId?: number
	currencyId: number
	before: {
		siteId?: number
		currencyId: number
		type: number
		typeName: string
		detail: IUpgradeSettingDetail[]
	}
	after: {
		siteId?: number
		currencyId: number
		type: number
		typeName: string
		detail: IUpgradeSettingDetail[]
	}
}

export type IEditForm = {
	silverClub: number
	goldClub: number
	titaniumClub: number
	diamondClub: number
}

export type IUpgradeSettingTableData = {
	currencyId: number
	typeName: string
	type: number
	vintageClub: number | null
	silverClub: number | null
	goldClub: number | null
	titaniumClub: number | null
	diamondClub: number | null
	novaClub: string | null
}

export enum VipLevelsEnum {
	VintageClub = 1,
	SilverClub,
	GoldClub,
	TitaniumClub,
	DiamondClub,
	NovaClub,
}
