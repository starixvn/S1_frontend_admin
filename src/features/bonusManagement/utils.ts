import {
	ICashBackSettingData,
	IDisplayCondition,
	IPromotionDisplayConditionData,
	ISpecificData,
	ISpecificDataFrontend,
} from 'features/bonusManagement/type'
import { Currency } from 'common/enum/type'
import { assign, cloneDeep, find, includes, omit } from 'lodash'
import {
	BonusTypeEnum,
	StatusEnum,
	WalletTypeEnum,
} from 'features/bonusManagement/constants'

// 多重比對 , 可用在條件渲染時  A = B | C | D 時顯示
// 第一個參數放 value 第二個放 條件 使用 Array 把所有該條件的參數放進 Array
export const multiEqual = <T>(value: T, others: Array<T>): boolean => {
	for (let i = 0; i <= others.length - 1; i += 1) {
		if (others[i] === value) {
			return true
		}
	}
	return false
}

// S2C 轉換 Specific
export const specificDataConverter = (
	specific: ISpecificData[],
	currencyList: Currency[]
) => {
	// 如果是空陣列直接回傳 (基本不會有空陣列,買個保險)
	if (specific?.length === 0) {
		return []
	}

	// 前端的 form 需要 isoCode 和 parse 過後的 details
	const result: ISpecificDataFrontend[] = []
	specific.forEach(data => {
		const { currencyId: currentId, details, ...rest } = data
		const isoCode = find(
			currencyList,
			currency => currency.currencyId === currentId
		)?.isoCode
		const parsedDetail = JSON.parse(details as string)

		result.push({
			isoCode,
			details: parsedDetail,
			currencyId: currentId,
			...rest,
		})
	})
	return result
}

// C2S 轉換 specifics
export const specificRequestDataConverter = ({
	specific,
	details,
	bonusCode,
	walletType,
	categoryId,
	tpId,
	promotionType,
	turnoverTpGameTypeList,
}: {
	specific: any
	details: any
	bonusCode: string
	walletType: number
	categoryId: number
	tpId: number
	promotionType?: number
	turnoverTpGameTypeList?: number[]
}): ISpecificData[] => {
	const rawSpecificData: any[] = []
	Object.values(specific).forEach(data => {
		const {
			active,
			products = [],
			minLoss,
			bonus,
		} = data as {
			active: boolean
			products: number[]
			minLoss: number
			bonus: number
		}

		const cashBackSetting: ICashBackSettingData = {
			lossAmount: minLoss,
			percentage: bonus,
			cashBackTpInfos: products?.map(product =>
				walletType === WalletTypeEnum.Seamless
					? {
							tpId: product,
							categoryId,
					  }
					: {
							tpId,
							categoryId: product,
					  }
			),
		}

		rawSpecificData.push(
			assign(omit(data as object, ['minLoss', 'products', 'active']), {
				bonusCode,
				status: active ? StatusEnum.Active : StatusEnum.InActive,
				cashBackSetting,
			})
		)
	})

	Object.keys(details).forEach(key => {
		const { currencyId = 0, langCode = '' } = JSON.parse(key)
		// 當前處理的 detailsData
		const detailValue = details[key] ?? {}
		const currentSpecific = find(
			rawSpecificData,
			data => data.currencyId === currencyId
		)
		// 現有的 detailsData
		const cloneDetailsValue = cloneDeep(currentSpecific?.details)
		const newDetailsData = assign(cloneDetailsValue, {
			[langCode]: {
				...detailValue,
			},
		})
		assign(currentSpecific, {
			details: newDetailsData,
		})
	})

	// return 時才將 details 全部轉成字串
	return rawSpecificData.map(data => {
		const { details: detailsObj, ...rest } = data
		if (promotionType === BonusTypeEnum.MissionBonus) {
			return {
				details: JSON.stringify(detailsObj),
				turnoverTpGameTypeList,
				...rest,
			}
		}

		return {
			details: JSON.stringify(detailsObj),
			...rest,
		}
	})
}

// S2C 取得 response 後處理編輯頁面 displayCondition 的資料
export const displayConditionResponseConverter = (
	displayCondition: IPromotionDisplayConditionData[]
): Array<number | string> => {
	// 若有設定 displayCondition 陣列數量會 > 0 , 若沒有就是沒限制 => 顯示 'all'
	// 但有些舊資料傳來會有 0 的選項 , 故手動篩出來改成 'all'
	if (displayCondition.length > 0) {
		const {
			description: { vipLevel },
		} = displayCondition[0]
		if (includes(vipLevel, 0)) {
			return ['all']
		}
		return vipLevel.map(level => level)
	}
	return ['all']
}

// C2S 轉換最終要送給 api 的 displayCondition 資料 , 若選 'all' 則代表 不打開 displayCondition 限制
export const displayConditionRequestConverter = (
	selectVipLevel: Array<number | string>
): IDisplayCondition => {
	// 如果選 all 代表沒有設定條件
	const isForVipLevel = !includes(selectVipLevel, 'all')
	const selectedVipLevel = isForVipLevel ? selectVipLevel : []

	return {
		isForVipLevel,
		selectedVipLevel,
	}
}
