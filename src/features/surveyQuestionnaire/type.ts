import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Dayjs } from 'dayjs'

export interface IFilterForm {
	dateRange: [Dayjs, Dayjs]
	currencyId: number
	userName: string
}

export interface IGetQuestionnaireReportArgs {
	siteId: number | undefined
	currencyId: number
	userName: string
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export interface IQuestionnaireReportData {
	id: number
	currency: string
	userName: string
	contactInfo: string
	content: string
	createTime: string
	feedback: string
	lastUpdateUser: string
	lastUpdateTime: string
}

export type IQuestionnaireReportResponse = IAxiosResponse<
	IQuestionnaireReportData[]
>

export interface ISetQuestionnaireReportArgs {
	id: number
	feedback: string
}

export interface IExportQuestionnaireReportArgs {
	siteId: number | undefined
	currencyId: number
	userName: string
	startDate: string
	endDate: string
}

export interface IEditForm {
	id: number
	userName: string
	contactInfo: string
	content: string
	feedback: string
}
