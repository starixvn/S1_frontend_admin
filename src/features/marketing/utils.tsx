import { assign } from 'lodash'
import { v4 as uuidV4 } from 'uuid'
import { IBonusAmountClaimedReportData } from 'features/marketing/type'

// S2C
// for Bonus Amount Claimed 的 tree Table
// 根據原始資料取出 groupByBonusCode 的 children 並放入內層
export const groupByBonusCodeResConverter = (
	marketingBonusAmountClaimedData: IBonusAmountClaimedReportData
): IBonusAmountClaimedReportData[] => {
	const result: any = []
	if (!marketingBonusAmountClaimedData.groupByBonusCode) return []

	marketingBonusAmountClaimedData.groupByBonusCode.forEach(items => {
		const children = items.children.map(item => {
			return assign({}, item, {
				key: uuidV4(),
				bonusAmountClaim: parseFloat(item.bonusAmountClaim.toFixed(2)),
				baseBonusAmountClaim: parseFloat(item.baseBonusAmountClaim.toFixed(2)),
			})
		})

		const groupInfo = assign({}, items.groupInfo, {
			key: uuidV4(),
			currency: items.groupInfo.bonusCode,
			bonusAmountClaim: parseFloat(items.groupInfo.bonusAmountClaim.toFixed(2)),
			children,
		})

		result.push(groupInfo)
	})

	return result
}
