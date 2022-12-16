import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetDomainListArgs {
	pageNumber: number
	pageSize: number
	siteId: number
	currencyIds: number[]
}

export interface IGetDomainListData {
	dId: number
	currencyId: number
	currency: string
	domain: string
	sort: number
	status: number
	lastUpdateUser: string
	lastUpdateTime: string
}

export type IGetDomainListResponse = IAxiosResponse<IGetDomainListData[]>

export interface ICreateDomainArgs {
	siteId: number
	currencyId: number
	domain: string
	status: number
	sort: number
}

export type ICreateDomainResponse = IAxiosResponse<null>

export interface IUpdateDomainArgs {
	id: number
	domain: string
	status: number
	sort: number
}

export type IUpdateDomainResponse = IAxiosResponse<null>

export interface IDeleteDomainArgs {
	id: number
}

export type IDeleteDomainResponse = IAxiosResponse<null>

export interface IFilterForm {
	currencyIds: number[]
	current?: number | undefined
	pageSize?: number | undefined
}

export interface IDomainForm {
	dId: number
	currencyId: number
	currency: string
	domain: string
	sort: number
	status: number
	lastUpdateUser: string
	lastUpdateTime: string
}

export interface IAddForm {
	currencyId: number
	domain: string
	status: number
	sort: number
}
