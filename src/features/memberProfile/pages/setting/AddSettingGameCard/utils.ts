import { assign, find, includes } from 'lodash'
import {
	ICustTpGameTypeSettingData,
	ISelectedGameTypes,
} from 'features/memberProfile/type'

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

// C2S
export const LiveStreamingGameReqConverter = (
	selectedGameTypes: Record<string, ISelectedGameTypes>
) => {
	const tpGameTypes: number[] = []
	// 初始化
	Object.values(selectedGameTypes)?.map(({ gameTypes }) =>
		gameTypes.map(gameTypeId => tpGameTypes.push(gameTypeId))
	)

	return { tpGameTypes }
}
