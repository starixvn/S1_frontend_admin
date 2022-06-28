import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export interface IDepositPointSettingData {
	currencyId: number
	isoCode: string
	depositAmount: number
	promotionStatus: boolean
	promotionPointRate: number
	promotionStartTime: string | null
	promotionEndTime: string | null
	promotionDateRange: [Moment, Moment]
	lastUpdater: string
	lastUpdateTime: string
}

export type IDepositPointSettingResponse = IAxiosResponse<
	IDepositPointSettingData[]
>

export interface ISetDepositPointSettingArgs {
	siteId: number | undefined
	currencyId: number
	depositAmount: number
	promotionStatus: number | boolean
	promotionPointRate: number
	promotionStartTime: string | null
	promotionEndTime: string | null
}
