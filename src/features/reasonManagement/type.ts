import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetFuncKeysListData {
	funcKey: string
}

export type IGetFuncKeysListResponse = IAxiosResponse<IGetFuncKeysListData[]>

export interface IGetReasonListArgs {
	funcKeys: string[]
	pageNumber: number
	pageSize: number
}

export interface IGetReasonListData {
	id: number
	funcKey: string
	reasonId: number
	description: string
	createTime: string
	creator: string
	updateTime: string
	updator: string
}

export type IGetReasonListResponse = IAxiosResponse<IGetReasonListData[]>

export interface ISetReasonArgs {
	id: number
	description: string
}

export interface ICreateReasonArgs {
	funcKey: string
	description: string
}
