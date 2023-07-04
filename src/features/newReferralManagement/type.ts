import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export enum ReferralStatusEnum {
	Disable,
	ReferralEnable,
	DepositReferralEnable,
}

export interface IGetDepositReferralArgs {
	siteId?: number
}

export interface IDepositReferralData {
	siteId: number
	currencyId: number
	isoCode: string
	depositRewardPercentage: number
	minPayout: number
	maxPayout: number
	status: number
}

export type IDepositReferralResponse = IAxiosResponse<IDepositReferralData[]>

export interface IGetDepositReferralDetailArgs {
	siteId?: number
	currencyId: number
}

export interface ISpecificDetailData {
	type: number
	langId: string
	bannerUrl: string
	title: string
	description: string
	detail: string
}

export interface IDepositReferralDetailData {
	siteId: number
	currencyId: number
	depositRewardPercentage: number
	minPayout: number
	maxPayout: number
	status: number
	specificList: ISpecificDetailData[]
}

export type IDepositReferralDetailResponse =
	IAxiosResponse<IDepositReferralDetailData>

export interface ISpecificData {
	langId: string
	bannerUrl: string
	title: string
	description: string
	detail: string
}

export interface ISetDepositReferralArgs {
	siteId?: number
	currencyId: number
	depositRewardPercentage: number
	minPayout: number
	maxPayout: number
	specificList: ISpecificData[]
}

export interface IUpdateDepositReferralStatusArgs {
	siteId?: number
	currencyId: number
	status: number
}

export interface IEditForm {
	currencyId: number
	depositRewardPercentage: number
	minPayout: number
	maxPayout: number
	specific: {
		[lang: string]: {
			langId: string
			bannerUrl: string
			title: string
			description: string
			detail: string
			type: number
		}
	}
}
