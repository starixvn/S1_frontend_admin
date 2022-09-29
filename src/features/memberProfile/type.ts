import { IAxiosResponse } from 'common/service/axiosBaseQuery'

// Sider 用戶資訊
export interface IGetBasicInfoArgs {
	custId: number
}

export interface ITagData {
	id: number
	tagName: string
	description: string
	tagColour: string
}
export interface IGetBasicInfoData {
	custId: number
	vipLevel: number
	vipLogo: string
	isOnline: boolean
	userName: string
	accountName: string
	phoneVerified: boolean
	emailVerified: boolean
	actStatus: number
	isLineBinding: boolean
	status: number
	depositPointLevel: number
	currency: string
	identity: number
	affiliatesName: string
	affiliatesCode: string
	registeredTime: string
	lineBindingTime: string
	firstDepositTime: string
	lastLoginTime: string
	lastActiveTime: string
	birthDay: string
	birthMonth: string
	birthYear: string
	email: string
	mobileNumber: string
	address: string
	isRisk: boolean
	isKyc: boolean
	isTest: boolean
	tagList: ITagData[]
}

export type IGetBasicInfoResponse = IAxiosResponse<IGetBasicInfoData>

export interface IDeleteCustPhotoIdArgs {
	custId: number
	id: number
}

export type IGetCustPhotoIdArgs = IGetBasicInfoArgs

export interface IGetCustPhotoData {
	id: number
	photoUrl: string
}

export type IGetCustPhotoResponse = IAxiosResponse<IGetCustPhotoData[]>
