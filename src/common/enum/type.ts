export interface UserSite {
	currencyList: Array<number>
	defLang: string
	iLangList: Array<string>
	langList: Array<string>
	siteId: number
	siteName: string
}

export interface Currency {
	actualRate: number
	currencyId: number
	isoCode: string
	note: string
	timeZone: string
}

export interface AdjustmentInfoLogMenuItem {
	name: string
	value: number
}

export interface ActionType {
	name: string
	value: number
}

export interface IAdminUserCurrency {
	siteCurrencyList: number[]
	rewardsCurrencyList: number[]
}
