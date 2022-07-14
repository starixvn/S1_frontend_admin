import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetMaintenanceArg {
	siteId?: number
}

export interface IGetMaintenanceData {
	maintain: boolean
	dateTimeStart: string
	utcTimeStart: string
	dateTimeEnd: string
	utcTimeEnd: string
}

export type IGetMaintenanceResponse = IAxiosResponse<IGetMaintenanceData>

export interface ISetMaintenanceArgs {
	siteId?: number
	maintain: boolean
	beginTime: string
	endTime: string
}
