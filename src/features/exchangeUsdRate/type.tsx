import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetUsdData {
	currencyId: number
	isoCode: string
	note: string
	usdRate: number
	isCrypto: true
	timeZone: string
	lastUpdateUser: string
	updateTime: string
}

export type IGetUsdRateListResponse = IAxiosResponse<IGetUsdData[]>

export interface ISetUsdArgs {
	currencyId: number
	usdRate: number
}
