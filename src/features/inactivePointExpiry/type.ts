import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetInactivePointExpirySettingArg {
	siteId: number | undefined
	currencyId?: number
}

interface IGetInactivePointExpirySettingData {
	days: number
	status: number
	lastUpdater: string
	lastUpdateTime: string | null
}

export type IGetInactivePointExpirySettingResponse =
	IAxiosResponse<IGetInactivePointExpirySettingData>

export interface ISetInactivePointExpirySettingArgs {
	siteId: number | undefined
	currencyId?: number
	status: number
	days: number
}
