export const BANK_BLOCK_STATUS_VALUE_OPTIONS = {
	ALL: 0,
	UNLOCK: 1,
	LOCK: 2,
}

export const BANK_BLOCK_STATUS = [
	{
		displayKey: 'Label_SelectAll',
		value: BANK_BLOCK_STATUS_VALUE_OPTIONS.ALL,
	},
	{
		displayKey: 'Label_Open',
		value: BANK_BLOCK_STATUS_VALUE_OPTIONS.UNLOCK,
	},
	{
		displayKey: 'Label_Lock',
		value: BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK,
	},
]

export const RELEASE_STATUS_VALUE_OPTIONS = {
	DELETE: 0,
	OPEN: 1,
}
