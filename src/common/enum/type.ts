export interface UserSite {
	currencyList: Array<number>
	defLang: string
	iCurrencyList: Array<number>
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
}
