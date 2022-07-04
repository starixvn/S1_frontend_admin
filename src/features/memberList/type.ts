import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetMemberListArgs {
	siteId?: number
	currencyIds: number[]
	vipLevels: number[]
	userName: string
	tpUserName: string
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export interface IGetMemberListData {
	custId: number
	isoCode: string
	userName: string
	tpUserName: string
	vipLevelName: string
	pointBalance: number
	pointEarned: number
	pointUsed: number
	lastUpdateTime: string
	lastRedemptionTime: string
}

export type IGetMemberListResponse = IAxiosResponse<IGetMemberListData[]>

// 取得個別用戶點數

export interface IGetMemberRewardPointLogArgs {
	custId: number
	startTime: string
	endTime: string
	pageNumber: number
	pageSize: number
}

export interface IGetMemberRewardPointLogData {
	typeName: string
	pointType: number
	refTransId: string
	changePoint: number
	beforePoint: number
	afterPoint: number
	memo: string
	operator: string
	createTime: string
}

export type IGetMemberRewardPointLogResponse = IAxiosResponse<
	IGetMemberRewardPointLogData[]
>

export interface IManualRewardPointArgs {
	siteId?: number
	userName: string
	point: number
	categoryId: number
	memo: string
}

export interface IBatchManualRewardPointArgs {
	siteId?: number
}

export interface IGetVipLevelSettingArg {
	siteId?: number
}

export interface IVipLevelData {
	level: number
	levelName: string
}

export type IGetVipLevelSettingResponse = IAxiosResponse<IVipLevelData[]>

export interface IGetCategoryData {
	id: number
	name: string
}

export type IGetCategoryResponse = IAxiosResponse<IGetCategoryData[]>
