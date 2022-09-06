import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IData {}

export interface IGetRegistrationManagementListArgs {
	siteId?: number
	currencyId: number
	depositStatus: number
	status: number
	userName: string
	startDate: string
	endDate: string
	affiliatesCode: null | string
	agentCodeType: number
	callOutStatus: number
	dormantUser: number
	dateType: number
	sort: number
	pageSize: number
	pageNumber: number
}

export type IRegistrationManagementData = {
	siteId: number
	custId: number
	currency: string
	agent: string
	affiliatesCode: string
	userName: string
	accountName: string
	phoneNo: null | number
	phoneVerified: number
	regTime: string
	lastActiveTime: null | string
	depositStatus: number
	status: number
	updateRemark: null | string[]
}

export type IRegistrationManagementResponse = IAxiosResponse<
	IRegistrationManagementData[]
>

export interface ISetRegistrationManagementArgs {
	siteId?: number
	custId: number
	status: number
}

export interface IExportRegistrationManagementArgs {
	siteId?: number
	currencyId?: number
	depositStatus: number
	status: number
	userName: string
	sort: number
	startDate: string
	endDate: string
	affiliatesCode: null | string
	agentCodeType: number
	callOutStatus: number
	dormantUser: number
	dateType: number
}

export interface IRegistrationManagementNoteData {
	id: number
	custId: number
	note: string
	updateTime: string
	operator: string
}

export type IRegistrationManagementNoteResponse = IAxiosResponse<
	IRegistrationManagementNoteData[]
>
