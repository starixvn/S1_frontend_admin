import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetWithdrawalLimitArgs {
	siteId?: number
	currencyId: number
}

export interface IGetWithdrawalLimitData {
	siteId: number
	currencyId: number
	vipLevel: number
	withdrawalMin: number
	withdrawalMax: number
	updateTime: string
	updateOperator: string
	levelName: string
	times: number
	totalWithdrawalMax: number
}

export type IGetWithdrawalLimitResponse = IAxiosResponse<
	IGetWithdrawalLimitData[]
>

export interface IGetWithdrawalLimitCryptoData {
	siteId: number
	currencyId: number
	vipLevel: number
	levelName: string
	times: number
	withdrawalMin: number
	withdrawalMax: number
	network: number
	networkType: number
	cryptoCurrencyId: number
}

export type IGetWithdrawalLimitCryptoResponse = IAxiosResponse<
	IGetWithdrawalLimitCryptoData[]
>

export type IUpdateWithdrawalDetailData = {
	vipLevel: number
	withdrawalMin: number | null
	totalWithdrawalMax: number | null
	times: number | null
}

export interface IUpdateWithdrawalCryptoDetailData {
	cryptoCurrency: number
	networkType: number
	vipLevel: number
	withdrawalMin: number | null
}

export interface IUpdateWithdrawalLimitArgs extends IGetWithdrawalLimitArgs {
	before?: IUpdateWithdrawalDetailData[]
	after: IUpdateWithdrawalDetailData[]
}

export interface IUpdateWithdrawalLimitCryptoArgs
	extends IGetWithdrawalLimitArgs {
	before: IUpdateWithdrawalCryptoDetailData[]
	after: IUpdateWithdrawalCryptoDetailData[]
}

// table 使用的資料結構 , 有可能是 null 前端顯示 N/A
export type IWithdrawalLimitationTableData = {
	vipLevel: number
	levelName: string
	times: number | null
	withdrawalMin: number | null
	totalWithdrawalMax: number | null
	UsdtErcMin: number | null
	UsdtTrcMin: number | null
	UsdcErcMin: number | null
	UsdcTrcMin: number | null
	EthMin: number | null
	BtcMin: number | null
}

// NetworkType 對照
export enum NetworkTypeEnum {
	ERC20 = 1,
	TRC20,
	ETH,
	BTC,
}

// CryptoCurrency對照
export enum CryptoCurrencyEnum {
	USDT = 96,
	USDC = 97,
	ETH = 98,
	BTC = 99,
}
