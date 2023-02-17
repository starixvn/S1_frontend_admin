import {
	IDisableGamesData,
	IDisableTpGameData,
} from 'features/gameExclusion/type'
import { assign, find } from 'lodash'

// S2C
export const gameExclusionResConverter = (value: IDisableGamesData[]) => {
	const selectedTp: number[] = []
	const selectedGames = {}
	value.forEach(({ checked, tpId, gameList }) => {
		// 有選才加入
		if (checked) {
			selectedTp.push(tpId)
			gameList?.forEach(({ checked: gameChecked, gameId }) => {
				// 有 checked 才加入
				if (gameChecked) {
					const exist = find(selectedGames, (_, key) => key === String(tpId))
					if (exist) {
						// 已存在
						const { games = [] as string[] } = exist
						games.push(gameId)
					} else {
						// 新增
						assign(selectedGames, {
							[String(tpId)]: {
								games: [gameId],
							},
						})
					}
				}
			})
		}
	})
	return { selectedTp, selectedGames }
}

// C2S
export const gameExclusionReqConverter = ({
	selectedTp,
	selectedGames,
}: {
	selectedTp: number[]
	selectedGames: Object
}): IDisableTpGameData[] => {
	// 初始化陣列雛形
	const result: IDisableTpGameData[] = selectedTp.map(tpId => {
		return { tpId, gameList: [] }
	})
	Object.entries(selectedGames).forEach(([key, value]) => {
		const target = find(result, ({ tpId }) => tpId === Number(key))
		const { games } = value as { games: string[] }
		if (target) {
			assign(target, { gameList: games })
		}
	})
	return result
}
