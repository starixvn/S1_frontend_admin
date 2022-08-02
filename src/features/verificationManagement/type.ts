import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetVerificationRewardArgs {
	siteId?: number
}

export interface IGetVerificationRewardData {
	siteId: number
	currencyId: number
	isoCode: string
	verificationType: number
	phoneReward: number
	emailReward: number
	status: number
	createTime: string
	lastUpdateUser: string
	lastUpdateTime: string
	minDeposit: number
}

export type IGetVerificationRewardResponse = IAxiosResponse<
	IGetVerificationRewardData[]
>

export type IStatusData = {
	status: number
}

export interface IUpdateStatusArgs {
	siteId?: number
	currencyId: number
	before: IStatusData
	after: IStatusData
}

export type IVerificationRewardSettingArgs = {
	verificationType: number
	phoneReward: number
	emailReward: number
	minDeposit: number
}

export interface ISetVerificationRewardArgs {
	siteId?: number
	currencyId: number
	before: IVerificationRewardSettingArgs
	after: IVerificationRewardSettingArgs
}

export enum VerificationTypeEnum {
	eitherOf,
	bothOf,
}
