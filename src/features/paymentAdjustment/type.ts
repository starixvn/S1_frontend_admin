import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import moment from 'moment'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'

export interface IExportPaymentAdjustmentReportArgs {
	adjustTypes: number[]
	currencyIds: number[]
	startDate: string
	endDate: string
	userName: string | null
	sabaId: string | null
	transId: string | null
	depositId: string | null
	memberTypes: UserTypeEnum[]
}

export interface IGetPaymentAdjustmentReportArgs
	extends IExportPaymentAdjustmentReportArgs {
	pageNumber: number
	pageSize: number
}

export interface IGetPaymentAdjustmentReportData {
	siteId: number
	currencyId: number
	custId: number
	siteName: string
	transId: string
	adjustType: number
	adjustTypeName: string
	adjustCategory: number
	adjustCategoryName: string
	userName: string
	currencyName: string
	amount: number
	createTime: string
	statusName: string
	memo: string
	sabaID: string
	operator: string
	walletType: string
	categoryName: string
	depositId: string
}

export type ICurrencyAmountRecordData = {
	currency: string
	amount: number
	record: number
}

// 這隻 api 給的 response 比較特別，使用 custom 的 response
export interface IGetPaymentAdjustmentReportResponse
	extends IAxiosResponse<IGetPaymentAdjustmentReportData[]> {
	currencyAmountRecord: ICurrencyAmountRecordData[]
}

// 新增 adjustType
export type IAdjustmentData = {
	category: number
	memo: string
	adjustType: number
}

export interface ISetAdjustmentArgs {
	currencyId: number
	siteId: number
	transId: string
	before: IAdjustmentData
	after: IAdjustmentData
}

export interface IGetReasonListData {
	id: number
	name: string
}

export type IFilterForm = {
	currencyIds: number[]
	adjustTypes: number[]
	dateRange: [moment.Moment, moment.Moment]
	userName: string
	sabaId: string
	transId: string
	depositId: string
	memberTypes: UserTypeEnum[]
}

export type IEditForm = {
	memo: string
	adjustCategory: number
	adjustType: number
}
