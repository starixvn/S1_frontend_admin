import dayjs from 'dayjs'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetUpgradeListArgs {
	siteId: number
	calculateYearMonth: string
	status: number[]
	userName: string
	currencyId: number[]
	pageNumber: number
	pageSize: number
}

export interface IUpgradeData {
	canUpdateStatus: boolean
	siteId: number
	siteName: string
	custId: number
	userName: string
	currencyId: number
	isoCode: string
	currentVipLevel: number
	currentVipName: string
	upgradeVipLevel: number
	upgradeVipName: string
	thresholdDeposit: number
	depositAmount: number
	upgradeBonus: number
	status: number
	calculateTime: string | number
	settleTime: string | number
	qualifiedTime: string | number
	lastUpdateUser: string
}

export type IUpgradeListResponse = IAxiosResponse<IUpgradeData[]>

export interface IGetDowngradeListArgs extends IGetUpgradeListArgs {}

export interface IDowngradeData {
	canUpdateStatus: boolean
	siteId: number
	siteName: string
	custId: number
	userName: string
	currencyId: number
	isoCode: string
	currentVipLevel: number
	currentVipName: string
	downgradeVipLevel: number
	downgradeVipName: string
	thresholdDeposit: number
	depositAmount: number
	thresholdTurnOver: number
	turnOverAmount: string
	status: string
	calculateTime: string | number
	settleTime: string | number
	qualifiedTime: string | number
	lastUpdateUser: string
}

export type IDowngradeListResponse = IAxiosResponse<IDowngradeData[]>

export interface IExportUpgradeListArgs {
	siteId: number
	yearMonth: string
	status: number[]
	userName: string
	currencyId: number[]
}

export interface IExportDowngradeListArgs {
	siteId: number
	calculateYearMonth: string
	status: number[]
	userName: string
	currencyId: number[]
}

export interface IUpdateUpgradeArgs {
	custIdList: number[]
	calculateYearMonth: string
	siteId: number
	newStatus: number
}

export type IUpdateUpgradeResponse = IAxiosResponse<null>

export interface IUpdateDowngradeArgs extends IUpdateUpgradeArgs {}

export type IUpdateDowngradeResponse = IAxiosResponse<null>

export interface IVipLevelData {
	errorCode: number
	message: string
	rawErrorCode: string
	rawMessage: string
}

export type IChangeVipLevelResponse = IVipLevelData[]

export interface IFilterForm {
	date: any
	dateRange: [dayjs.Dayjs, dayjs.Dayjs]
	status: number[]
	userName: string
	currencyIds: number[]
	type: number
	current?: number | undefined
	pageSize?: number | undefined
}
