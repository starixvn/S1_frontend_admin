import { IAxiosResponse } from 'common/service/axiosBaseQuery'

/** GetEventRestrictionList api 參數 */
export interface IGetEventRestrictionListArgs {
	siteId: number | undefined
	currencyId: number
	userName: string | null
}

/** SetEventRestriction api 參數 */
export interface ISetEventRestrictionArgs {
	reason: string | null
	userName: string | null
}

/** DelEventRestriction api 參數 */
export interface IDelEventRestrictionArgs {
	userName: string | null
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
	userName: null | string
}

export interface IAddForm {
	userName: string | null
	reason: string | null
}
