import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import moment from 'moment'
import { UploadFile } from 'antd/es/upload/interface'

export interface IGetBankInfoListArgs {
	siteId: number
	sabaId: string
	userName: string
	purpose: number
}

export interface IGetBankInfoListData {
	bankId: number
	siteId: number
	siteName: string
	currencyId: number
	isoCode: string
	channel: number
	accountName: string
	accountNo: string
	accountCode: string
	displayName: string
	accountStatus: number
	settingStatus: number
	purpose: string
	purposes: number[]
	jsonPointLevels: string
	pointLevels: number[]
	jsonVipLevels: string
	vipLevels: number[]
	minAmount: number
	maxAmount: number
	sysId: number
	bankCode: string
	bankName: string
	bankLoginUrl: string
	bankLoginAccount: string
	bankLoginPassword: string
	transferPin: string
	loginPin: string
	mobilePin: string
	corporateID: string
}

export type IGetBankInfoListResponse = IAxiosResponse<IGetBankInfoListData[]>

export interface IFilterForm {
	userName: string
	sabaId: string
}

export interface IDepositForm {
	accountStatus: string
	accountNo: string
	bankName: string
	accountName: string
	amount: string
	dateTime: moment.Moment
	referenceNo: string
	memo: string
	receipt: UploadFile[]
}
