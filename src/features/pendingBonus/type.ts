import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetPendingBonusListArgs {
	siteIds: number[]
}

export interface IPendingBonusData {
	bonusCode: string
	promotionType: number
	siteId: string
	siteName: string
	userName: string
	bonusId: number
	lockedAmount: number
	bonusAmount: number
	bonus: number
	rollover: number
	expiryTime: string
	createTime: string
	custId: number
	tpId: number
}

export type IGetPendingBonusListResponse = IAxiosResponse<IPendingBonusData[]>

export interface ITransferMultiArgs {
	bonusIdList: number[]
}

export interface ITransferMultiData {
	bonusId: number
	result: {
		errorCode: number
		message: string
		rawErrorCode: string
		rawMessage: string
	}
}

export type ITransferMultiResponse = IAxiosResponse<ITransferMultiData[]>
