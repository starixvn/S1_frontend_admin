import { Dayjs } from 'dayjs'

export interface IGetAdminUserLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
	startDate: string
	endDate: string
}

export interface IAdminUserLogData {
	createTime: string
	id: number
	currencyId: number
	isoCode: string
	siteId: number
	siteName: string
	menu: number
	menuFunction: string
	actionType: number
	actionTypeName: string
	refTransId: string
	beforeDetailInfoObject: null | {
		userName: string
		[action: string]: string
	}
	afterDetailInfoObject: null | {
		userName: string
		[action: string]: string
	}
	operator: string
}

export type IFilterForm = {
	dateRange: [Dayjs, Dayjs]
	status: number[]
}
