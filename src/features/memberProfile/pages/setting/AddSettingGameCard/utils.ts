import { assign, find, includes } from 'lodash'
import { ICustTpGameTypeSettingData } from 'features/memberProfile/type'

// S2C

export const LiveStreamingGameResConverter = (
	value: ICustTpGameTypeSettingData[]
) => {
	const selectedTp: number[] = []
	const selectedGameTypes = {}
	value.forEach(({ tpId, gameType }) => {
		if (!includes(selectedTp, tpId)) {
			selectedTp.push(tpId)
		}

		const exist = find(selectedGameTypes, (_, key) => key === String(tpId))
		if (exist) {
			// 已存在
			const { gameTypes = [] as number[] } = exist
			gameTypes.push(gameType)
		} else {
			// 新增
			assign(selectedGameTypes, {
				[String(tpId)]: {
					gameTypes: [gameType],
				},
			})
		}
	})

	return { selectedTp, selectedGameTypes }
}
