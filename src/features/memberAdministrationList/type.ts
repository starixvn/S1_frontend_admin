import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { Dayjs } from 'dayjs'
import {
	DateTypeEnum,
	IdentityEnum,
	IovationLevelEnum,
	ShieldLevelEnum,
	StatueEnum,
	UserTypeEnum,
} from './constants'

/**
 * * 不設條件 int 帶0, string 帶 null
 * * int siteId: 站台Id
 * * int[] currencyId: 幣別(複選)
 * * int[] status: 會員狀態(複選) 1:running, 2:suspend, 3: closed, 4:lock
 * * int identity: 會員怎麼來, 1: Normal (直客), 2: Referral (推薦), 3: Affiliate (代理)
 * * string userName: 會員Id, ex hulkchou
 * * int[] tags: 標籤, 選單請參考 TagEnum
 * * int[] vipLevel: vip等級,選單請參考 VIPEnum
 * * string accountName: FullName 帳戶名稱, ex 習大大
 * * string tpUserName: SabaId, ex DNova88_250032
 * * string affiliateName: 代理名稱, ex N88AFF021
 * * string loginIp: 登入Ip
 * * string email: email
 * * string phoneNo: 電話號碼
 * * string bankAccountNumber: 銀行帳戶號碼
 * * string affiliateCode: 代理推薦碼
 * * string transId: 存款單/提款單/轉帳單
 * * int shieldLevel: 1: High Risk, 2: Low Risk
 * * int iovationLevel: 1:D, 2:B, 3:R, 4:A
 * * string deviceId: 裝置Id
 * * int userTypes: 會員的身分, 1:Normal(一般人), 2: Affiliate (代理) 3.LiveStreaming(直播主)
 * * int dateType: 1: Register Date, 2: Status Update Date, 3: Tag Update Date
 * * datetime startDate: 起始時間
 * * datetime endDate: 結束時間
 * * int pageSize 1頁幾筆
 * * int pageNumber 第幾頁,從1開始
 * * boolean exportTransferWallet 是否輸出轉帳錢包餘額
 */
export interface IGetMemberListArgs {
	siteId: number
	currencyId: number[]
	status: StatueEnum[]
	identity: IdentityEnum
	userName: null | string // * MemberId
	tags: null | number[] // * tags 需參考 TagManagement/GetAllTag 得來的 Enum
	vipLevel: null | number[] // * vipLevel 需參考 VipLevel/GetSetting 得來的 Enum
	accountName: null | string // * Full Name
	tpUserName: null | string // * Saba Id
	affiliateName: null | string
	loginIp: null | string
	email: null | string
	phoneNo: null | string
	bankAccountNumber: null | string
	affiliateCode: null | string
	transId: null | string
	shieldLevel: ShieldLevelEnum
	iovationLevel: IovationLevelEnum
	deviceId: null | string
	userTypes: UserTypeEnum[]
	dateType: DateTypeEnum
	exportTransferWallet: boolean | number
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
	excludeTag: boolean
	eWalletAccountNumber: null | string
	cryptoAddress: null | string
}

export interface IMemberData {
	siteName: string
	currencyId: number
	isoCode: string
	custId: number
	userName: string
	sabaId: string
	affiliateCode: null | string
	affiliateName: null | string
	identity: number
	pointLevel: number
	userType: number
	tagList: number[]
	userLevel: number
	agent: string
	status: number
	isTest: boolean
	ip: string
	levelName: string
	regTime: string
	lastActiveTime: null | string
	lastTagUpdateTime: null | string
	lastStatusUpdateTime: null | string
	balance: number
	bonus: number
	deviceScore: null | string
	deviceId: null | string
}

export type IMemberResponse = IAxiosResponse<IMemberData[]>

export interface ITagData {
	id: number
	tagName: string
	tagColour: string
	description: string
}

export interface IVipLevelData {
	level: number
	levelName: string
}

export interface IMemberTypeData {
	name: string
	value: number
}

export interface IExportMemberArgs {
	siteId: number
	currencyId: number[]
	status: StatueEnum[]
	identity: IdentityEnum
	userName: null | string // * MemberId
	tags: null | number[]
	vipLevel: null | number[]
	accountName: null | string // * Full Name
	tpUserName: null | string // * Saba Id
	affiliateName: null | string
	loginIp: null | string
	email: null | string
	phoneNo: null | string
	bankAccountNumber: null | string
	affiliateCode: null | string
	transId: null | string
	shieldLevel: ShieldLevelEnum
	iovationLevel: IovationLevelEnum
	deviceId: null | string
	userTypes: UserTypeEnum[]
	dateType: DateTypeEnum
	startDate: '2022-10-05T09:00:01+08:00'
	endDate: '2022-10-05T09:00:01+08:00'
	exportTransferWallet: boolean
	excludeTag: boolean
	eWalletAccountNumber: null | string
	cryptoAddress: null | string
}

export interface IForm {
	dateRange: [Dayjs, Dayjs]
	currencyIds: number[]
	statuses: number[]
	identity: IdentityEnum
	userName: null | string
	tpUserName: null | string
	affiliateName: null | string
	loginIp: null | string
	email: null | string
	phoneNo: null | string
	accountName: null | string
	bankAccountNumber: null | string
	affiliateCode: null | string
	tags: number[]
	vipLevel: number[]
	transId: null | string
	shieldLevel: ShieldLevelEnum
	iovationLevel: IovationLevelEnum
	dateType: DateTypeEnum
	deviceId: null | string
	exportTransferWallet: boolean | number
	userTypes: UserTypeEnum[]
	excludeTag: boolean
	eWalletAccountNumber: null | string
	cryptoAddress: null | string
}

export interface IGetRegisterMemberArgs {
	siteId: number
	userName: string
	userpwd: string
	memberType: number
	email: string
	currencyId: number
	areaCode: string
	phoneNo: string
	affCode: string
	realName: string
}

export interface IAddForm {
	userName: string
	userpwd: string
	memberType: number
	email: string
	currencyId: number
	areaCode: string
	phoneNo: string
	affCode: string
	realName: string
}
