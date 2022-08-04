import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetLineChannelListArgs {
	pageNumber: number
	pageSize: number
	siteId?: number
	currencyIds: number[]
}

export interface IGetLineChannelListData {
	id: number
	siteId: number
	currencyId: number
	isoCode: string
	link: string
	status: number
	createTime: string
	updateTime: string
	lastOperator: string
}

export type IGetLineChannelListResponse = IAxiosResponse<
	IGetLineChannelListData[]
>

export type ILineChannelArg = {
	id: number
	link: string
	status: number
}

export interface ISetLineChannelArgs {
	siteId?: number
	currencyId: number
	transId: null
	before?: ILineChannelArg
	after: ILineChannelArg
}

export type IDeleteChannelArg = {
	id: number
	link: string
}

export interface IDeleteLineChannelArgs {
	siteId?: number
	currencyId: number
	transId: null
	before: IDeleteChannelArg
	after: IDeleteChannelArg
}
