// 列表頁
export interface IGetHotGameListArgs {
	siteId?: number
	currencyId: number
	topCategory: number
	tpId: number
	tpGameType: number
	pageSize: number
	pageNumber: number
}

export interface IHotGameData {
	id: number
	topCategory: string
	tpName: string
	tpGameType: string
	gameName: string
	gameId: string
	sort: number
	lastUpdateTime: string
	lastUpdateUser: string
}

// 編輯內頁細節
export interface IGetHotGameDetailArgs {
	siteId?: number
	id: number
}

export interface IHotGameDetailData {
	id: number
	siteId: number
	currencyId: number
	gameName: string
	gameId: string
	tpId: number
	tpGameType: number
	tpCategory: number
	tpCategoryName: string
	hotGamePcUrl: string
	hotGameMobileUrl: string
	topCategory: number
}

// Set , 新增 id 帶 0
export interface ISetDataArgs {
	id: number
	siteId?: number
	currencyId: number
	gameName: string
	gameId: string
	tpId: number
	tpName: string
	tpGameType: number
	tpCategory: number
	hotGamePcUrl: string
	hotGameMobileUrl: string
	topCategory: number
}

// Delete
export type IDeleteHotGameArgs = IGetHotGameDetailArgs

export interface ISortData {
	id: number
	sort: number
	siteId: number
}

// Sorting
export type ISetSortArgs = ISortData[]

// HotGameTopCategory
export interface IHotGameTopCategoryData {
	hotGameTopCategoryId: number
	hotGameTopCategoryName: string
}

// CommonTpList
export interface ICommonTpData {
	id: number
	tpName: string
}

// tpGameType
export interface IGetTpGameTypeArgs {
	tpId: number
}

export interface ITpGameTypeData {
	tpId: number
	type: number
	typeName: string
	categoryId: number
	categoryName: string
}

export interface IFilterForm {
	topCategory: number
	tpId: number
	tpGameType: number
}

export interface IEditForm {
	id: number
	currencyId: number
	gameName: string
	gameId: string
	tpId: number
	tpName: string
	tpGameType: number
	tpCategory: number
	hotGamePcUrl: string
	hotGameMobileUrl: string
	topCategory: number
}
