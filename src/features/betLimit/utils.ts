// C2S
import { find, cloneDeep, assign, findIndex, mapKeys, omit } from 'lodash'
import { ITpCategoryListData, IGameTypeBetLimit } from 'features/betLimit/type'
import { GameTypeEnum } from 'features/betLimit/constants'

export const TpBetLimitCategoryListConverter = (
	list: ITpCategoryListData[]
) => {
	const result: IGameTypeBetLimit[] = []
	list.forEach(data => {
		if (data.gameType === GameTypeEnum.SBO_Sports) {
			const { min, max, maxPerMatch } = data.limitInput
			result.push({
				checked: data.checked,
				tpCategory: data.categoryId,
				tpCategoryName: data.categoryName,
				gameTypeId: data.gameType,
				gameTypeName: data.gameTypeName,
				min,
				max,
				maxPerMatch,
			})
		} else {
			const { checked, gameTypeName } = data
			result.push({
				checked,
				tpCategory: data.categoryId,
				tpCategoryName: data.categoryName,
				gameTypeId: data.gameType,
				gameTypeName,
				limitGroup: checked ? data.selectedGroup : null,
				limitRange: checked
					? data.limitGroup.find(obj => obj.group === data.selectedGroup)?.range
					: null,
			})
		}
	})

	return result
}

// S2C
export const CustBetLimitConverter = (
	list: IGameTypeBetLimit[],
	tableList: ITpCategoryListData[]
) => {
	// 被插入用於渲染的 List
	const result = cloneDeep(tableList)
	// user 的真實數據
	const newList = cloneDeep(list)
	const mapNewList: { [index: string]: string } = {
		limitGroup: 'selectedGroup',
		tpCategory: 'categoryId',
		tpCategoryName: 'categoryName',
		gameTypeId: 'gameType',
		gameTypeName: 'gameTypeName',
		checked: 'checked',
		limitRange: 'limitRange',
	}

	newList.forEach(data => {
		// 更改成能用於渲染 table 的 key
		const actualLists = omit(
			mapKeys(data, (value, key) => {
				return mapNewList[key]
			}),
			[
				'limitGroup',
				'tpCategory',
				'tpCategoryName',
				'gameTypeId',
				'gameTypeName',
				'limitRange',
				// 移除掉其他有可能對應不到的錯誤
				'undefined',
			]
		)
		// SBO 需多插入 limitInput
		if (data.gameTypeId === GameTypeEnum.SBO_Sports) {
			assign(result[findIndex(tableList, ['gameType', data.gameTypeId])], {
				limitInput: {
					min: data.min,
					max: data.max,
					maxPerMatch: data.maxPerMatch,
				},
				...actualLists,
			})
		}

		if (find(tableList, ['gameType', data.gameTypeId])) {
			assign(
				result[findIndex(tableList, ['gameType', data.gameTypeId])],
				actualLists
			)
		}
	})
	return result
}
