export const GIFT_LIST_STATUS_OPTIONS = {
	CLOSE: 0,
	OPEN: 1,
}

export const GIFT_LIST_STATUS = [
	{
		displayKey: 'Label_Close',
		value: GIFT_LIST_STATUS_OPTIONS.CLOSE,
	},
	{
		displayKey: 'Label_Open',
		value: GIFT_LIST_STATUS_OPTIONS.OPEN,
	},
]

export const allStatuses = Object.values(GIFT_LIST_STATUS_OPTIONS)

// 目前三方跟遊戲ID由前端寫死,到時候會改接後端api
export const GIFT_LIST_PROVIDER_OPTIONS = [{ key: 'PP', value: 'PP' }]
export const GIFT_LIST_GAME_OPTIONS = [
	{ key: 'vs20olympnova88', value: 'vs20olympnova88' },
]
