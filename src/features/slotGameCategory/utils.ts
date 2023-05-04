// S2C

import {
	IGetSlotGamesListData,
	ITableColumnsInfo,
} from 'features/slotGameCategory/type'
import { Currency } from 'common/enum/type'
import { assign, find } from 'lodash'

export const slotGameResponseConverter = (
	slotGameList: IGetSlotGamesListData[],
	currencyList: Currency[]
) => {
	const result: any[] = []
	const columnsInfo: ITableColumnsInfo[] = []

	slotGameList.forEach(game => {
		const { currencyStatusList, ...rest } = game
		const gameItem = { ...rest }
		let isAllActive = true

		currencyStatusList.forEach(currencyStatus => {
			const { currencyId, status } = currencyStatus
			const currentIsoCode = find(
				currencyList,
				cur => cur.currencyId === currencyId
			)?.isoCode
			if (currentIsoCode) {
				if (!status) {
					isAllActive = false
				}
				const dataIndex = JSON.stringify({
					isoCode: currentIsoCode,
					currencyId,
				})
				// 寫入 columnInfo 供 table渲染使用
				if (!find(columnsInfo, info => info.title === currentIsoCode)) {
					columnsInfo.push({
						title: currentIsoCode,
						dataIndex,
					})
				}
				// return 扁平化過後的tableSource
				assign(gameItem, {
					[dataIndex]: status,
				})
			}
		})

		assign(gameItem, {
			activeInactiveAll: isAllActive,
		})

		result.push(gameItem)
	})

	return { dataSource: result, tableColumns: columnsInfo }
}
