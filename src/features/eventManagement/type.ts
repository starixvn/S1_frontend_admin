import { Dayjs } from 'dayjs'
import { IAxiosResponse } from '../../common/service/axiosBaseQuery'

export interface IGetLotteryEventSettingArgs {
	siteId?: number
	startDate: string
	endDate: string
}

export interface ILotteryEventSettingData {
	sq: number
	siteId: number
	roundId: number
	startDate: string
	endDate: string
	drawDate: string
	status: number
	excludeSetting: string
	updator: string
	createTime: string
	updateTime: string
}

export interface ISetLotteryEventSettingArgs {
	sq: number
	startDate: string
	endDate: string
	drawDate: string | Dayjs
	isSuspend: number
	firstPrize: number
	secondPrize: number
	thirdPrize: number
	consolation: number
	small: number
}

export interface IAddLotteryEventSettingArgs {
	siteId?: number
	startDate: string
	endDate: string
	drawDate: string | Dayjs
	isSuspend: number
	firstPrize: number
	secondPrize: number
	thirdPrize: number
	consolation: number
	small: number
}

export interface ILotteryTicketHistoryData {
	siteId: number
	roundId: string
	firstPrizeList: string[]
	secondPrizeList: string[]
	thirdPrizeList: string[]
	consolationPrizeList: string[]
	smallPrizeList: string[]
	stickerId: number
}

export interface IGetLotteryTicketHistoryArgs {
	siteId?: number
	roundId: number
}

export interface IRaffleTicketStickerSettingData {
	// 於前端給的 unique key
	key: string
	siteId: number
	currencyId: number
	stickerPrize: number
	turnOver: number
	updator: string
	updateTime: string
}

export type IRaffleTicketStickerSettingResponse = IAxiosResponse<
	IRaffleTicketStickerSettingData[]
>

export interface IGetRaffleTicketStickerSettingArgs {
	siteId?: number
}

export interface ISetRaffleTicketStickerSettingArgs {
	siteId?: number
	currencyId: number
	stickerPrize: number
	turnOver: number
}

export interface ISetCreateLotteryMaintainArgs {
	siteId?: number
	beginDate: string
	endDate: string
	isMaintain: boolean
}

export type TFilterForm = {
	siteId: number
	dateRange: [Dayjs, Dayjs]
	status: number[]
}

export type TMaintainForm = {
	siteId: number
	dateRange: [Dayjs, Dayjs]
	isMaintain: boolean
}

export interface IEditOrAddForm {
	status: number
	isSuspend: boolean | number
	dateRange: [Dayjs, Dayjs]

	// 存後端的 ISO 格式字串
	startDateISOStr: string
	endDateISOStr: string
	drawDateISOStr: string

	sq: number
	startDate: string
	endDate: string
	drawDate: string | Dayjs
	firstPrize: number
	secondPrize: number
	thirdPrize: number
	consolation: number
	small: number
}

export interface IEditRaffleTicketAndStickerForm {
	currencyId: number
	stickerPrize: number
	turnOver: number
}
