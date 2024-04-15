import { assign, get, findIndex, cloneDeep, forEach, isNumber } from 'lodash'
import {
	GameLevelsEnum,
	GameRebateEditData,
	ICategoryLevelData,
	IGameRebateData,
	IGameRebateTableData,
	IGetRebateInfoResponse,
	IRebateTableData,
} from '../type'

export const rebateTableDataConverter = (
	{ data } = {} as IGetRebateInfoResponse
): Array<IRebateTableData> =>
	data.categoryDataList.map(item => {
		const payoutIndex = data.payoutLimitList.findIndex(
			payoutItem => payoutItem.categoryId === item.categoryId
		)

		const getLevelPercentage = (
			dataList: ICategoryLevelData[],
			gameLevel: number
		) => {
			const currentLevel = dataList.find(
				(levelItem: ICategoryLevelData) => levelItem.level === gameLevel
			)
			return currentLevel?.percentage
		}

		return {
			categoryId: item.categoryId,
			categoryName: item.categoryName,
			vintageClub:
				getLevelPercentage(
					item.categoryLevelList,
					GameLevelsEnum.VintageClub
				) ?? null,
			silverClub:
				getLevelPercentage(item.categoryLevelList, GameLevelsEnum.SilverClub) ??
				null,
			goldClub:
				getLevelPercentage(item.categoryLevelList, GameLevelsEnum.GoldClub) ??
				null,
			titaniumClub:
				getLevelPercentage(
					item.categoryLevelList,
					GameLevelsEnum.TitaniumClub
				) ?? null,
			diamondClub:
				getLevelPercentage(
					item.categoryLevelList,
					GameLevelsEnum.DiamondClub
				) ?? null,
			novaClub:
				getLevelPercentage(item.categoryLevelList, GameLevelsEnum.NovaClub) ??
				null,
			maxPayout:
				payoutIndex !== -1 ? data.payoutLimitList[payoutIndex].maxPayout : null,
			minPayout:
				payoutIndex !== -1 ? data.payoutLimitList[payoutIndex].minPayout : null,
		}
	})

export const errorsFilterWithIndexes = (res: PromiseSettledResult<void>[]) => {
	const errors: Array<{ error: PromiseRejectedResult; key: number }> = []
	res.forEach((item, i) => {
		if (item.status === 'rejected') {
			errors.push({ error: item, key: i })
		}
	})
	return errors
}

export const gameTypeRebateTableConverter = (
	data: IGameRebateData[]
): IGameRebateTableData[] => {
	const levelsName = {
		1: 'vintageClub',
		2: 'silverClub',
		3: 'goldClub',
		4: 'titaniumClub',
		5: 'diamondClub',
		6: 'novaClub',
	}
	const GameRebateTableData: IGameRebateTableData[] = []
	data.forEach(item => {
		const { gameType, gameTypeName, level, percentage } = item
		const currentLevel = get(levelsName, level)
		const index = findIndex(
			GameRebateTableData,
			target => target.gameType === gameType
		)
		if (index === -1) {
			const newObj = {
				gameType,
				gameTypeName,
				[currentLevel]: percentage,
			}
			GameRebateTableData.push(cloneDeep(newObj) as IGameRebateTableData)
		} else {
			assign(GameRebateTableData[index], { [currentLevel]: percentage })
		}
	})
	return GameRebateTableData
}

export const editCellValuesToEditList = (
	formValue: any
): GameRebateEditData => {
	const levelsIndexes = {
		vintageClub: 1,
		silverClub: 2,
		goldClub: 3,
		titaniumClub: 4,
		diamondClub: 5,
		novaClub: 6,
	}
	const result = {}
	forEach(formValue, (value: any, key: string) => {
		if (key === 'gameType') {
			assign(result, { [key]: value })
		}
		if (key === 'gameTypeName') {
			assign(result, { [key]: value })
		} else {
			const currentLevel = get(levelsIndexes, key)
			assign(result, {
				level: currentLevel,
				percentage:
					value && isNumber(Number(value)) && value >= 0 ? Number(value) : null,
			})
		}
	})
	return result as GameRebateEditData
}

// 如果沒有值 || 為負數 , 強制為 0
export const valueFormatter = (value: string | number | null): number => {
	if (value && isNumber(Number(value)) && Number(value) >= 0) {
		return Number(value)
	}
	return 0
}
