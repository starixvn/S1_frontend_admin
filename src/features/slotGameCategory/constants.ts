export enum SlotGameStatusEnum {
	ALL,
	Open,
	Closed,
}

export const slotGameStatusList: Array<{ value: number; displayName: string }> =
	[
		{ value: SlotGameStatusEnum.ALL, displayName: 'Label_All' },
		{ value: SlotGameStatusEnum.Open, displayName: 'Label_On' },
		{ value: SlotGameStatusEnum.Closed, displayName: 'Label_Off' },
	]

export enum SlotCategoryEnum {
	AllAndSetStatus,
	Featured,
	Jackpot,
	TableAndCards,
	BuyFeaturesGames,
	Megaways,
}

export const slotGameCategoryList: Array<{
	value: number
	displayName: string
}> = [
	{
		value: SlotCategoryEnum.AllAndSetStatus,
		displayName: 'Label_AllAndSetStatus',
	},
	{ value: SlotCategoryEnum.Featured, displayName: 'Label_Featured' },
	{ value: SlotCategoryEnum.Jackpot, displayName: 'Label_Jackpot' },
	{ value: SlotCategoryEnum.TableAndCards, displayName: 'Label_TableAndCards' },
	{
		value: SlotCategoryEnum.BuyFeaturesGames,
		displayName: 'Label_BuyFeaturesGame',
	},
	{
		value: SlotCategoryEnum.Megaways,
		displayName: 'Label_Megaways',
	},
]

export enum DeviceEnum {
	All,
	Web,
	Mobile,
	App,
}

export const deviceList: Array<{ value: number; displayName: string }> = [
	{ value: DeviceEnum.All, displayName: 'Label_All' },
	{ value: DeviceEnum.Web, displayName: 'Label_Web' },
	{ value: DeviceEnum.Mobile, displayName: 'Label_Mobile' },
	{ value: DeviceEnum.App, displayName: 'Label_App' },
]
