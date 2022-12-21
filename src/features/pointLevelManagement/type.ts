import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IPointLevelData {
	siteId: number
	currencyId: number
	pointLevel: number
	depositCnt: number
	withdrawalCnt: number
	isKyc: boolean
}

export interface IGetPointLevelArgs {
	siteId?: number
	currencyId?: number
}

export interface ICreatePointLevelArgs {
	siteId?: number
	currencyId: number
	pointLevel: number
	depositCnt: number
	withdrawalCnt: number
	isKyc: boolean
}

export interface IUpdatePointLevelArgs {
	siteId?: number
	currencyId?: number
	pointLevel?: number
	depositCnt: number
	withdrawalCnt: number
	isKyc: boolean
}

export interface IDeletePointLevelArgs {
	siteId?: number
	currencyId?: number
	pointLevel: number
}

export type IEditForm = {
	depositCnt: number
	withdrawalCnt: number
	isKyc: boolean
}

export type IPointLevelResponse = IAxiosResponse<IPointLevelData[]>
