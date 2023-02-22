import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { UploadFile } from 'antd/es/upload/interface'

export interface IGetBatchMemberInfoReportArgs {
	siteId?: number
}

export interface IBatchMemberInfoReportData {
	batchId: number
	author: string
	status: number
	_createTime: string
	createTime: string
	_updateTime: string
	updateTime: string
	statusName: string
	url: string
	memo: string
}

export type IBatchMemberInfoReportResponse = IAxiosResponse<
	IBatchMemberInfoReportData[]
>

export interface IForm {
	memo: string
	fileList: UploadFile[]
}

export enum BatchMemberInfoReportStatusColorEnums {
	Pending = 'Pending',
	Finished = 'Finished',
	Failed = 'Failed',
}

export enum BatchMemberInfoReportDownloadStatusEnums {
	Pending,
	Finished,
	Failed,
}
