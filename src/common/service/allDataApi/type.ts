import { IAxiosResponse } from '../axiosBaseQuery'

export interface IVipLevelsData {
	siteId: number
	level: number
	levelName: string
	fixed: number
	createTime: string
	updateTime: string
}

export type IVipLevelsResponse = IAxiosResponse<IVipLevelsData[]>

export interface IBankInfoSysData {
	bankCode: string
	bankLogo: string
	bankName: string
	bankSite: string
	currencyId: number
	sysId: number
}

export type IBankInfoSysResponse = IAxiosResponse<IBankInfoSysData[]>
