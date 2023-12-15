export interface IGetBigWinSettingArgs {
	siteId?: number
}

export interface IBigWinSettingData {
	siteId: number
	currencyId: number
	tpCategory: string
	multipleOfWinning: number
	status: number
	currencyName: string
	siteName: string
	minOfWinning: number
	iTpCategoryList: number[]
}

export interface ISetBigWinSettingArgs {
	siteId: number
	currencyId: number
	before: {
		siteId: number
		currencyId: number
		multipleOfWinning: number
		status: number
		minOfWinning: number
		tpCategory: string
	}
	after: {
		siteId: number
		currencyId: number
		multipleOfWinning: number
		status: number
		minOfWinning: number
		tpCategory: string
	}
}

export interface IEditForm {
	siteId: number
	currencyId: number
	multipleOfWinning: number
	minOfWinning: number
	iTpCategoryList: number[]
}
