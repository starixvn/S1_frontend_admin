import { assign, find, includes, isUndefined } from 'lodash'
import {
	ICustTpGameTypeSettingData,
	ISelectedGameTypes,
} from 'features/memberProfile/type'

// S2C

export const LiveStreamingGameResConverter = (
	value: ICustTpGameTypeSettingData[]
) => {
	const initTp: number[] = []
	const initGameTypes = {}
	value.forEach(({ tpId, gameType }) => {
		if (!includes(initTp, tpId)) {
			initTp.push(tpId)
		}

		const exist = find(initGameTypes, (_, key) => key === String(tpId))
		if (exist) {
			// 已存在
			const { gameTypes = [] as number[] } = exist
			gameTypes.push(gameType)
		} else {
			// 新增
			assign(initGameTypes, {
				[String(tpId)]: {
					gameTypes: [gameType],
				},
			})
		}
	})

	return { initTp, initGameTypes }
}

// C2S
export const LiveStreamingGameReqConverter = (
	selectedGameTypes: Record<string, ISelectedGameTypes>
) => {
	const tpGameTypes: number[] = []
	// GameTypes 沒選則帶 []
	if (isUndefined(selectedGameTypes)) {
		return { tpGameTypes }
	}

	Object.values(selectedGameTypes)?.map(({ gameTypes }) =>
		gameTypes.map(gameTypeId => tpGameTypes.push(gameTypeId))
	)

	return { tpGameTypes }
}
