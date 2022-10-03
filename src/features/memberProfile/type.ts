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

export interface ICustLineProfile {
	custId: number
	userId: string
	createTime: string
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
	custLineProfile: ICustLineProfile
	status: number
	depositPointLevel: number
	currency: string
	identity: number
	affiliatesName: string
	affiliatesCode: string
	registeredTime: string
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

// sider 照片刪除
export interface IDeleteCustPhotoIdArgs {
	custId: number
	id: number
}

// 取得 sider 的 custPhoto
export type IGetCustPhotoIdArgs = IGetBasicInfoArgs

export interface IGetCustPhotoData {
	id: number
	photoUrl: string
}

export type IGetCustPhotoResponse = IAxiosResponse<IGetCustPhotoData[]>

// vipLevelLog Log 頁
export interface IGetVipLevelLogArgs {
	pageNumber: number
	pageSize: number
	custId: number
}

export interface IGetVipLevelLogData {
	oldLevel: number
	newLevel: number
	memo: string
	updateTime: string
	updaters: string
}

export type IGetVipLevelLogResponse = IAxiosResponse<IGetVipLevelLogData[]>

// Referral History 頁面
export type IGetReferralHistoryArgs = IGetVipLevelLogArgs

export interface IGetReferralHistoryData {
	custId: number
	userName: string
	currencyId: number
	currency: string
	registerDate: string
	totalDeposit: number
	depositC: number
	totalBet: number
	validBetC: number
	bonusAmount: number
	referralFreeCredit: number
	rewardTime: string
	status: number
	statusName: string
}

export type IGetReferralHistoryResponse = IAxiosResponse<
	IGetReferralHistoryData[]
>

// Notes 頁面
export type IGetCustNotesArgs = IGetVipLevelLogArgs

export interface IGetCustNotesData {
	id: number
	custId: number
	note: string
	createTime: string
	updateTime: string
	operator: string
}

export type IGetCustNotesResponse = IAxiosResponse<IGetCustNotesData[]>

export interface IAddCustNoteArgs {
	siteId?: number
	custId: number
	note: string
}

export interface ISetCustNoteArgs {
	siteId?: number
	custId: number
	type: number
	noteId: number
	note: string
}
