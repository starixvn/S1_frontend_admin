import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetProtocolTypeEnumArgs {
	enumName: string
}

export interface IGetAppLinkArgs {
	siteId?: number
}

export interface ISetAppLinkArgs {
	siteId?: number
	domain: string
	appType: number
	protocolType: number
}

export interface IGetAppTypeEnumData {
	name: string
	value: number
}

export interface IGetProtocolTypeEnumData {
	name: string
	value: number
}

export interface IGetAppLinkListData {
	// 於前端給的 unique key
	key: string
	siteId: number
	siteName: string
	domain: string
	appType: number
	protocolType: number
	lastUpdateUser: string
	appTypeName: string
	protocolTypeName: string
	lastUpdateTime: string
}

export type IEditForm = {
	appTypeName: number
	protocolTypeName: number
	domain: string
}

export type IProtocolTypeEnumResponse = IAxiosResponse<
	IGetProtocolTypeEnumData[]
>

export type IGetAppLinkResponse = IAxiosResponse<IGetAppLinkListData[]>
