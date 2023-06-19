import { ISlotGameData, ISlotTpData } from 'common/service/allDataApi'
import {
	IEditForm,
	IExcludeGameData,
	IRebateExcludeGameData,
	ISelectedGames,
	ITpGameData,
} from 'features/rebateExcludeGame/type'
import { filter, find } from 'lodash'

// 用 selectedTp 篩 gameList
export const tpGamesConverter = ({
	selectedTps,
	slotTpList,
	slotGameList,
}: {
	selectedTps: number[]
	slotTpList: ISlotTpData[]
	slotGameList: ISlotGameData[]
}): ITpGameData[] => {
	return selectedTps.map(tpId => {
		const currentTp = find(slotTpList, { tpId })
		const tpGames = filter(slotGameList, { tpId })
		return {
			tpId,
			tpName: currentTp?.tpName || '',
			tpGames,
		}
	})
}

// S2C
export const rebateExcludeGameResConverter = (
	data: IRebateExcludeGameData[]
): IEditForm => {
	const selectedTp = data.reduce((acc, cur) => {
		if (!acc.includes(cur.tpId)) {
			acc.push(cur.tpId)
		}
		return acc
	}, [] as number[])

	const selectedGames = data.reduce((acc, cur) => {
		if (!acc[cur.tpId]) {
			acc[cur.tpId] = {
				games: [cur.gameId],
			}
		} else {
			acc[cur.tpId].games.push(cur.gameId)
		}
		return acc
	}, {} as IEditForm['selectedGames'])
	return {
		selectedTp,
		selectedGames,
	}
}

// C2S
export const rebateExcludeGameReqConverter = ({
	data,
	slotGameList,
}: {
	data: ISelectedGames
	slotGameList: ISlotGameData[]
}): IExcludeGameData[] => {
	const result = [] as IExcludeGameData[]
	Object.entries(data).forEach(([tpId, { games }]) => {
		games.forEach(gameId => {
			const currentGame = find(slotGameList, { gameId, tpId: Number(tpId) })
			if (currentGame) {
				const { gameType, categoryId, appId } = currentGame
				result.push({
					tpId: Number(tpId),
					gameType,
					categoryId,
					gameId,
					appId,
				})
			}
		})
	})

	return result
}
