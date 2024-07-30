import { IAxiosResponse } from 'common/service/axiosBaseQuery'

/** GetEventRestrictionList api 參數 */
export interface IGetEventRestrictionListArgs {
	SiteId: number | undefined
	CurrencyId: number
	UserName: string | null
}

/** SetEventRestriction api 參數 */
export interface ISetEventRestrictionArgs {
	Reason: string | null
	UserName: string | null
}

/** DelEventRestriction api 參數 */
export interface IDelEventRestrictionArgs {
	UserName: string | null
}

/** GetEventRestrictionList api 回傳資料 */
export interface IGetEventRestrictionListData {
	siteId: number
	currencyId: number
	currency: string
	custId: number
	userName: string | null
	sabaId: string
	reason: string
	creator: string
	taggingTime: string
}

export type IGetEventRestrictionListResponse = IAxiosResponse<
	IGetEventRestrictionListData[]
>

export type ISetEventRestrictionResponse = IAxiosResponse<null>

export type IDelEventRestrictionResponse = IAxiosResponse<null>

export interface IFilterForm {
	currencyId: number
	username: null | string
}

export interface IAddForm {
	UserName: string | null
	Reason: string | null
}
