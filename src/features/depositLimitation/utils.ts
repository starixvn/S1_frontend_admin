import {
	IDepositTableData,
	IDepositTableFormData,
	IGetDepositLimitData,
	IUpdateDepositLimitData,
} from 'features/depositLimitation/type'
import { multiEqual } from 'common/utils'
import {
	assign,
	clone,
	cloneDeep,
	find,
	includes,
	isNull,
	isNumber,
} from 'lodash'
import { DepositTypeEnum } from 'type'

// S2C response converter
export const depositLimitationResponseConverter = (
	depositLimitData: IGetDepositLimitData[]
) => {
	// 只顯示目前定義的三種 type 其他資料 filter 掉
	const filteredData = depositLimitData.filter(data =>
		multiEqual(data.depositType, [
			DepositTypeEnum.LocalBanking as number,
			DepositTypeEnum.OnlineBanking as number,
			DepositTypeEnum.MobilePay as number,
			DepositTypeEnum.QuickTransfer as number,
		])
	)

	const result: IDepositTableData[] = []
	const sampleObj: IDepositTableData = {
		vipLevel: 0,
		onlineBankingMax: null,
		onlineBankingMin: null,
		onlineBankingStatus: null,
		mobilePayMax: null,
		mobilePayMin: null,
		mobilePayStatus: null,
		localBankingMax: null,
		localBankingMin: null,
		localBankingStatus: null,
		quickTransferMax: null,
		quickTransferMin: null,
		quickTransferStatus: null,
	}

	filteredData?.forEach(data => {
		const { vipLevel, depositType, depositMax, depositMin, depositStatus } =
			data
		let obj
		switch (depositType) {
			case DepositTypeEnum.OnlineBanking:
				obj = {
					onlineBankingMax: depositMax,
					onlineBankingMin: depositMin,
					onlineBankingStatus: depositStatus,
				}
				break
			case DepositTypeEnum.MobilePay:
				obj = {
					mobilePayMax: depositMax,
					mobilePayMin: depositMin,
					mobilePayStatus: depositStatus,
				}
				break
			case DepositTypeEnum.LocalBanking:
				obj = {
					localBankingMax: depositMax,
					localBankingMin: depositMin,
					localBankingStatus: depositStatus,
				}
				break
			case DepositTypeEnum.QuickTransfer:
				obj = {
					quickTransferMax: depositMax,
					quickTransferMin: depositMin,
					quickTransferStatus: depositStatus,
				}
				break
			default:
				obj = {}
				break
		}
		const currentItem = find(result, item => item.vipLevel === vipLevel)
		if (currentItem) {
			// assign exist object
			assign(currentItem, obj)
		} else {
			// clone and push to result
			const cloneSample = clone(sampleObj)
			assign(cloneSample, { vipLevel, ...obj })
			result.push(cloneSample)
		}
	})

	return result
}

// C2S converter
export class DepositLimitationC2S {
	private static exampleData: IUpdateDepositLimitData[] = [
		{
			depositType: DepositTypeEnum.OnlineBanking as number,
			vipLevel: 0,
			depositMin: 0,
			depositMax: 0,
			depositStatus: 0,
		},
		{
			depositType: DepositTypeEnum.MobilePay as number,
			vipLevel: 0,
			depositMin: 0,
			depositMax: 0,
			depositStatus: 0,
		},
		{
			depositType: DepositTypeEnum.LocalBanking as number,
			vipLevel: 0,
			depositMin: 0,
			depositMax: 0,
			depositStatus: 0,
		},
		{
			depositType: DepositTypeEnum.QuickTransfer as number,
			vipLevel: 0,
			depositMin: 0,
			depositMax: 0,
			depositStatus: 0,
		},
	]

	static update({
		formData,
		record,
	}: {
		formData: IDepositTableFormData
		record: IDepositTableData
	}): {
		before: IUpdateDepositLimitData[]
		after: IUpdateDepositLimitData[]
		create: IUpdateDepositLimitData[]
	} {
		// before
		const {
			vipLevel,
			onlineBankingStatus: onlineBankingStatusBefore,
			onlineBankingMax: onlineBankingMaxBefore,
			onlineBankingMin: onlineBankingMinBefore,
			mobilePayStatus: mobilePayStatusBefore,
			mobilePayMax: mobilePayMaxBefore,
			mobilePayMin: mobilePayMinBefore,
			localBankingStatus: localBankingStatusBefore,
			localBankingMax: localBankingMaxBefore,
			localBankingMin: localBankingMinBefore,
			quickTransferStatus: quickTransferStatusBefore,
			quickTransferMax: quickTransferMaxBefore,
			quickTransferMin: quickTransferMinBefore,
		} = record

		// after
		const {
			onlineBankingStatus,
			onlineBankingMax,
			onlineBankingMin,
			mobilePayStatus,
			mobilePayMax,
			mobilePayMin,
			localBankingStatus,
			localBankingMax,
			localBankingMin,
			quickTransferStatus,
			quickTransferMax,
			quickTransferMin,
		} = formData

		const beforeData = cloneDeep(this.exampleData)
			.map(example => {
				example.vipLevel = vipLevel
				switch (example.depositType) {
					case DepositTypeEnum.OnlineBanking:
						example.depositStatus = Number(onlineBankingStatusBefore)
						example.depositMax = onlineBankingMaxBefore
						example.depositMin = onlineBankingMinBefore
						break
					case DepositTypeEnum.MobilePay:
						example.depositStatus = Number(mobilePayStatusBefore)
						example.depositMax = mobilePayMaxBefore
						example.depositMin = mobilePayMinBefore
						break
					case DepositTypeEnum.LocalBanking:
						example.depositStatus = Number(localBankingStatusBefore)
						example.depositMax = localBankingMaxBefore
						example.depositMin = localBankingMinBefore
						break
					case DepositTypeEnum.QuickTransfer:
						example.depositStatus = Number(quickTransferStatusBefore)
						example.depositMax = quickTransferMaxBefore
						example.depositMin = quickTransferMinBefore
						break
					default:
						break
				}
				return example
			})
			.filter(rawData => {
				// 篩掉原先沒有設定的 data
				const values = Object.values(rawData)
				let result = true
				for (let i = 0; i < values.length; i += 1) {
					if (isNull(values[i])) {
						result = false
					}
				}
				return result
			})

		const rawAfterData = cloneDeep(this.exampleData).map(example => {
			example.vipLevel = vipLevel
			switch (example.depositType) {
				case DepositTypeEnum.OnlineBanking:
					example.depositStatus = Number(onlineBankingStatus)
					example.depositMax = onlineBankingMax
					example.depositMin = onlineBankingMin
					break
				case DepositTypeEnum.MobilePay:
					example.depositStatus = Number(mobilePayStatus)
					example.depositMax = mobilePayMax
					example.depositMin = mobilePayMin
					break
				case DepositTypeEnum.LocalBanking:
					example.depositStatus = Number(localBankingStatus)
					example.depositMax = localBankingMax
					example.depositMin = localBankingMin
					break
				case DepositTypeEnum.QuickTransfer:
					example.depositStatus = Number(quickTransferStatus)
					example.depositMax = quickTransferMax
					example.depositMin = quickTransferMin
					break
				default:
					break
			}
			return example
		})

		const filteredAfterData = rawAfterData.filter(raw => {
			const beforeDepositTypes = beforeData.map(before => before.depositType)
			return includes(beforeDepositTypes, raw.depositType)
		})
		// 如果沒有資料則不做新增
		const createData = rawAfterData
			.filter(raw => {
				const beforeDepositTypes = beforeData.map(before => before.depositType)
				return !includes(beforeDepositTypes, raw.depositType)
			})
			.filter(data => isNumber(data.depositMin) && isNumber(data.depositMax))

		return {
			before: beforeData,
			after: filteredAfterData,
			create: createData,
		}
	}

	static create(formData: IDepositTableFormData): IUpdateDepositLimitData[] {
		const {
			vipLevel,
			onlineBankingStatus,
			onlineBankingMax,
			onlineBankingMin,
			mobilePayStatus,
			mobilePayMax,
			mobilePayMin,
			localBankingStatus,
			localBankingMax,
			localBankingMin,
			quickTransferStatus,
			quickTransferMax,
			quickTransferMin,
		} = formData

		const result = cloneDeep(this.exampleData).map(example => {
			example.vipLevel = vipLevel
			switch (example.depositType) {
				case DepositTypeEnum.OnlineBanking:
					example.depositStatus = Number(onlineBankingStatus)
					example.depositMax = onlineBankingMax
					example.depositMin = onlineBankingMin
					break
				case DepositTypeEnum.MobilePay:
					example.depositStatus = Number(mobilePayStatus)
					example.depositMax = mobilePayMax
					example.depositMin = mobilePayMin
					break
				case DepositTypeEnum.LocalBanking:
					example.depositStatus = Number(localBankingStatus)
					example.depositMax = localBankingMax
					example.depositMin = localBankingMin
					break
				case DepositTypeEnum.QuickTransfer:
					example.depositStatus = Number(quickTransferStatus)
					example.depositMax = quickTransferMax
					example.depositMin = quickTransferMin
					break
				default:
					break
			}
			return example
		})
		// 將沒有填入資料的欄位篩掉
		return result.filter(
			obj => isNumber(obj.depositMax) && isNumber(obj.depositMin)
		)
	}

	static updateStatus({
		record,
		status,
		depositType,
	}: {
		record: IDepositTableData
		status: boolean
		depositType: number
	}): {
		before: IUpdateDepositLimitData[]
		after: IUpdateDepositLimitData[]
	} {
		const result: IUpdateDepositLimitData = {
			depositType: 0,
			vipLevel: 0,
			depositMin: 0,
			depositMax: 0,
			depositStatus: 0,
		}
		const {
			vipLevel,
			onlineBankingMax,
			onlineBankingMin,
			mobilePayMax,
			mobilePayMin,
			localBankingMax,
			localBankingMin,
			quickTransferMax,
			quickTransferMin,
		} = record

		switch (depositType) {
			case DepositTypeEnum.OnlineBanking:
				result.depositType = DepositTypeEnum.OnlineBanking as number
				result.vipLevel = vipLevel
				result.depositStatus = Number(status)
				result.depositMax = onlineBankingMax
				result.depositMin = onlineBankingMin
				break
			case DepositTypeEnum.MobilePay:
				result.depositType = DepositTypeEnum.MobilePay as number
				result.vipLevel = vipLevel
				result.depositStatus = Number(status)
				result.depositMax = mobilePayMax
				result.depositMin = mobilePayMin
				break
			case DepositTypeEnum.LocalBanking:
				result.depositType = DepositTypeEnum.LocalBanking as number
				result.vipLevel = vipLevel
				result.depositStatus = Number(status)
				result.depositMax = localBankingMax
				result.depositMin = localBankingMin
				break
			case DepositTypeEnum.QuickTransfer:
				result.depositType = DepositTypeEnum.QuickTransfer as number
				result.vipLevel = vipLevel
				result.depositStatus = Number(status)
				result.depositMax = quickTransferMax
				result.depositMin = quickTransferMin
				break
			default:
				break
		}

		// before 只有 status 會和 after 不一樣
		const before = cloneDeep(result)
		before.depositStatus = Number(!status)

		return {
			before: [before],
			after: [result],
		}
	}
}
