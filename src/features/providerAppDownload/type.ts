// DeepLink 清單
export interface IGetDeepLinkListData {
	id: number
	name: string
}

// DeepLink 資料
export interface IGetDeepLinkArgs {
	siteId?: number
	deepLinkId: number
	pageNumber: number
	pageSize: number
}

export interface IGetDeepLinkData {
	// 於前端給的 unique key
	key: string
	siteId: number
	siteName: string
	domain: string
	type: number
	typeName: string
	protocolType: number
	protocolTypeName: string
	deepLinkId: number
	deepLinkName: string
	lastUpdateUser: string
	lastUpdateTime: string
}

export interface ISetDeepLinkArgs {
	siteId?: number
	deepLinkId: number
	domain: string
	type: number
	protocolType: number
}

export type IFilterForm = {
	deepLinkId: number
}

export type IEditForm = {
	deepLinkId: number
	domain: string
	type: number
	protocolType: number
}
