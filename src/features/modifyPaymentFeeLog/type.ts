import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Moment } from 'moment'

export interface IGetModifyPaymentChargeFeeListArgs {
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export interface IModifyPaymentChargeFeeData {
	id: number
	currencyId: number
	payName: string
	channelName: string
	chargeFeePercentage: number
	chargeFeePreCount: number
	startTime: string
	endTime: string
	createTime: string
	operator: string
}

export type IGetModifyPaymentChargeFeeListResponse = IAxiosResponse<
	IModifyPaymentChargeFeeData[]
>

export interface ISubmitPaySettingArgs {
	currencyId: number
	channelId: number
	chargeFeePercentage: number
	chargeFeePreCount: number
	startTime: string
	endTime: string
}

export interface IFilterForm {
	dateRange: [Moment, Moment]
}

export interface IModalForm {
	currencyId: number
	channelId: number
	chargeFeePercentage: number
	chargeFeePreCount: number
	dateRange: [Moment, Moment]
}
