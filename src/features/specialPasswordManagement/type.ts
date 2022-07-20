import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetSpecialPasswordArg {
	siteId?: number
}

export interface IGetSpecialPasswordData {
	siteId: number
	password: string
	updateTime: string
	updator: string
	siteName: string
}

export type IGetSpecialPasswordResponse =
	IAxiosResponse<IGetSpecialPasswordData>

export interface ISetSpecialPasswordArgs extends IGetSpecialPasswordArg {
	password: string
}
