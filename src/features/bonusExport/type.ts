import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IExportBonusListArgs {
	siteIds: number[]
	currencyIds: number[]
	baseCurrencyId: number
	userName: string
	tpUserName: string
	transId: string
	eventTypeId: number
	bonusCode: string
	eventNames: string[]
	startDate: string
	endDate: string
}

export interface IGetBonusListArgs extends IExportBonusListArgs {
	pageNumber: number
	pageSize: number
}

export interface IGetBonusListData {
	siteId: number
	siteName: string
	custId: number
	isoCode: string
	currencyId: number
	userName: string
	sabaId: string
	agent: string
	transId: string
	bonusCode: string
	eventType: string
	eventTypeId: number
	eventName: string
	amount: number
	createTime: string
}

export type IGetBonusListResponse = IAxiosResponse<IGetBonusListData[]>

export type IDrawPrizesEventName = { eventName: string }

export type IDrawPrizesEventNameResponse = IAxiosResponse<
	IDrawPrizesEventName[]
>

export type IGetBonusEventName = {
	type: number
	promotionTypeName: string
}

export type IGetBonusEventNamesResponse = IAxiosResponse<IGetBonusEventName[]>
