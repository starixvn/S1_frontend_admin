import {
	CryptoCurrencyEnum,
	IGetWithdrawalLimitCryptoData,
	IGetWithdrawalLimitData,
	IUpdateWithdrawalCryptoDetailData,
	IUpdateWithdrawalDetailData,
	IWithdrawalLimitationTableData,
	NetworkTypeEnum,
} from 'features/withdrawalLimitation/type'
import { find } from 'lodash'

// S2C 把兩隻 api 的 response 轉成 table 可用的結構
export const limitationResponseConverter = ({
	limitList,
	cryptoLimitList,
}: {
	limitList: IGetWithdrawalLimitData[]
	cryptoLimitList: IGetWithdrawalLimitCryptoData[]
}): IWithdrawalLimitationTableData[] => {
	const result: IWithdrawalLimitationTableData[] = []

	limitList?.forEach(list => {
		// 賦予當前 site 的 vipLevelLog 初始值
		const { vipLevel, levelName, totalWithdrawalMax, times, withdrawalMin } =
			list
		// 0 不要顯示 , 測試用的
		if (vipLevel !== 0) {
			result.push({
				vipLevel,
				levelName,
				times,
				withdrawalMin,
				totalWithdrawalMax,
				UsdtErcMin: null,
				UsdtTrcMin: null,
				UsdcErcMin: null,
				UsdcTrcMin: null,
				EthMin: null,
				BtcMin: null,
			})
		}
	})

	// 新增 cryptoCurrency 的參數
	cryptoLimitList?.forEach(crypto => {
		const { cryptoCurrencyId, networkType, withdrawalMin, vipLevel } = crypto
		const currentLevel = find(result, data => data.vipLevel === vipLevel)
		if (!currentLevel) return
		if (
			cryptoCurrencyId === CryptoCurrencyEnum.USDT &&
			networkType === NetworkTypeEnum.ERC20
		) {
			currentLevel.UsdtErcMin = withdrawalMin
		} else if (
			cryptoCurrencyId === CryptoCurrencyEnum.USDT &&
			networkType === NetworkTypeEnum.TRC20
		) {
			currentLevel.UsdtTrcMin = withdrawalMin
		} else if (
			cryptoCurrencyId === CryptoCurrencyEnum.USDC &&
			networkType === NetworkTypeEnum.ERC20
		) {
			currentLevel.UsdcErcMin = withdrawalMin
		} else if (
			cryptoCurrencyId === CryptoCurrencyEnum.USDC &&
			networkType === NetworkTypeEnum.TRC20
		) {
			currentLevel.UsdcTrcMin = withdrawalMin
		} else if (
			cryptoCurrencyId === CryptoCurrencyEnum.ETH &&
			networkType === NetworkTypeEnum.ETH
		) {
			currentLevel.EthMin = withdrawalMin
		} else if (
			cryptoCurrencyId === CryptoCurrencyEnum.BTC &&
			networkType === NetworkTypeEnum.BTC
		) {
			currentLevel.BtcMin = withdrawalMin
		}
	})

	return result
}

// C2S 更新 Currency Limit request
export const updateLimitRequestConverter = ({
	record,
	limitValue,
}: {
	record: IWithdrawalLimitationTableData
	limitValue: {
		withdrawalMin: number
		times: number
		totalWithdrawalMax: number
	}
}): {
	before: IUpdateWithdrawalDetailData[]
	after: IUpdateWithdrawalDetailData[]
} => {
	const {
		vipLevel,
		withdrawalMin: withdrawalMinBefore,
		totalWithdrawalMax: totalBefore,
		times: timesBefore,
	} = record

	const { withdrawalMin, times, totalWithdrawalMax } = limitValue

	return {
		before: [
			{
				vipLevel,
				withdrawalMin: withdrawalMinBefore,
				totalWithdrawalMax: totalBefore,
				times: timesBefore,
			},
		],
		after: [{ vipLevel, withdrawalMin, times, totalWithdrawalMax }],
	}
}

// C2S 更新 Crypto Limit request
export const updateCryptoLimitRequestConverter = ({
	record,
	limitValue,
}: {
	record: IWithdrawalLimitationTableData
	limitValue: {
		UsdtErcMin: number
		UsdtTrcMin: number
		UsdcErcMin: number
		UsdcTrcMin: number
		EthMin: number
		BtcMin: number
	}
}): {
	before: IUpdateWithdrawalCryptoDetailData[]
	after: IUpdateWithdrawalCryptoDetailData[]
} => {
	const {
		vipLevel,
		UsdtErcMin: UsdtErcMinBefore,
		UsdtTrcMin: UsdtTrcMinBefore,
		UsdcErcMin: UsdcErcMinBefore,
		UsdcTrcMin: UsdcTrcMinBefore,
		EthMin: EthMinBefore,
		BtcMin: BtcMinBefore,
	} = record

	const { UsdtErcMin, UsdtTrcMin, UsdcTrcMin, UsdcErcMin, BtcMin, EthMin } =
		limitValue

	return {
		before: [
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDT,
				networkType: NetworkTypeEnum.ERC20,
				withdrawalMin: UsdtErcMinBefore,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDT,
				networkType: NetworkTypeEnum.TRC20,
				withdrawalMin: UsdtTrcMinBefore,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDC,
				networkType: NetworkTypeEnum.ERC20,
				withdrawalMin: UsdcErcMinBefore,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDC,
				networkType: NetworkTypeEnum.TRC20,
				withdrawalMin: UsdcTrcMinBefore,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.ETH,
				networkType: NetworkTypeEnum.ETH,
				withdrawalMin: EthMinBefore,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.BTC,
				networkType: NetworkTypeEnum.BTC,
				withdrawalMin: BtcMinBefore,
			},
		],
		after: [
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDT,
				networkType: NetworkTypeEnum.ERC20,
				withdrawalMin: UsdtErcMin,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDT,
				networkType: NetworkTypeEnum.TRC20,
				withdrawalMin: UsdtTrcMin,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDC,
				networkType: NetworkTypeEnum.ERC20,
				withdrawalMin: UsdcErcMin,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.USDC,
				networkType: NetworkTypeEnum.TRC20,
				withdrawalMin: UsdcTrcMin,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.ETH,
				networkType: NetworkTypeEnum.ETH,
				withdrawalMin: EthMin,
			},
			{
				vipLevel,
				cryptoCurrency: CryptoCurrencyEnum.BTC,
				networkType: NetworkTypeEnum.BTC,
				withdrawalMin: BtcMin,
			},
		],
	}
}
