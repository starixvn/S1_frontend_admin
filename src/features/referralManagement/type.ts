import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export type SpecificState = {
	langId: string
	bannerUrl: string
	title: string
	description: string
	detail: string
}

export interface ReferralState {
	siteId: number
	currencyId: number
	bonusAmount: number
	invitationLimit: number
	agentValidBet: number
	agentDeposit: number
	referralFreeCredit: number
	validBet: number
	deposit: number
	periodDays: string
	specificList: SpecificState[]
	status: number
}

export type IGetReferralResponse = IAxiosResponse<ReferralState>

export interface IReferralsState {
	bonusAmount: number
	currencyId: number
	deposit: number
	invitationLimit: number
	isoCode: string
	periodDays: number
	referralFreeCredit: number
	siteId: number
	status: boolean
	validBet: number
}

export type IGetReferralsResponse = IAxiosResponse<IReferralsState[]>

export interface AddReferralArgs {
	siteId: number | undefined
	currencyId: number
	bonusAmount: number
	invitationLimit: number
	agentDeposit: number
	agentValidBet: number
	referralFreeCredit: number
	validBet: number
	deposit: string
	periodDays: string
	specificList: SpecificState[]
}
