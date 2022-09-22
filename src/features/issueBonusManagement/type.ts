import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface ICustInfoDetailsData {
	custId: number
	currencyId: number
}

export type ICustInfoDetailsResponse = IAxiosResponse<ICustInfoDetailsData>

export interface ITierAmountData {
	bonus: number
	maxBonus: number
	requiredAmount: number
	rollOver: number
	winOver: number
}

export interface ICheckBonusCodeData {
	promotionType: number
	bonusType: number
	hasBonusCode: true
	bonusCode: string
	bonus: number
	rollOver: number
	winOver: number
	walletType: number
	tpId: number
	categoryId: number
	name: string
	tierAmountList: ITierAmountData[] | null
}

export type ICheckBonusCodeResponse = IAxiosResponse<ICheckBonusCodeData>

export interface ICheckTierRedepositBonusArgs {
	custId: number
	bonusCode: string
	siteId: number
	currencyId: number
	depositId: string
}

export interface ICheckTierRedepositBonusData {
	isSuccess: boolean
	depositId: string
	actualDeposit: number
	lockAmount: number
	bonusAmount: number
	rolloverAmount: number
}

export type ICheckTierRedepositBonusResponse =
	IAxiosResponse<ICheckTierRedepositBonusData>

export interface ISetBonusPayoutArgs {
	custId: number
	amount: number
	bonusCode: string
	rollOver: number
	promotionType: number
}

export interface IAdjustmentLimitInfo {
	siteId: number
	currencyId: number
	adjustmentMax: number
	updateTime: string
	updateOperator: string
}

export type IAdjustmentLimitResponse = IAxiosResponse<IAdjustmentLimitInfo>
