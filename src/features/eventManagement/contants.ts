/** TicketHistoryModalModal 的 Prize */
export enum LotteryPrizeEnum {
	First = 1,
	Second,
	Third,
	Consolation = 'Consolation',
	Small = 'Small',
}

/** 當前活動狀態 */
export enum LotteryStatusEnum {
	Running = 0,
	Done,
	Suspended,
	Payout,
}

/** 生肖貼紙 Enum */
export enum LotteryStickerEnum {
	Rat = 1,
	Ox,
	Tiger,
	Cat,
	Dragon,
	Snake,
	Horse,
	Goat,
	Monkey,
	Rooster,
	Dog,
	Pig,
}

/** Tag Map 表 */
export const LOTTERY_EVENT_STATUS_TAGS_COLOR: { [status: number]: string } = {
	[LotteryStatusEnum.Running]: '#2DA7EC',
	[LotteryStatusEnum.Done]: '#3EA62E',
	[LotteryStatusEnum.Suspended]: '#C70707',
	[LotteryStatusEnum.Payout]: '#0747A6',
}

/** Tag 多語系狀態表 */
export const LOTTERY_EVENT_STATUS_DISPLAY_NAME: { [status: number]: string } = {
	[LotteryStatusEnum.Running]: 'Label_Running',
	[LotteryStatusEnum.Done]: 'Label_Done',
	[LotteryStatusEnum.Suspended]: 'Label_Suspended',
	[LotteryStatusEnum.Payout]: 'Label_Payout',
}

/**  生肖貼紙多語系表 */
export const LOTTERY_STICKER_NAME: { [stickerId: number]: string } = {
	[LotteryStickerEnum.Rat]: 'Label_Rat',
	[LotteryStickerEnum.Ox]: 'Label_Ox',
	[LotteryStickerEnum.Tiger]: 'Label_Tiger',
	[LotteryStickerEnum.Cat]: 'Label_Cat',
	[LotteryStickerEnum.Dragon]: 'Label_Dragon',
	[LotteryStickerEnum.Snake]: 'Label_Snake',
	[LotteryStickerEnum.Horse]: 'Label_Horse',
	[LotteryStickerEnum.Goat]: 'Label_Goat',
	[LotteryStickerEnum.Monkey]: 'Label_Monkey',
	[LotteryStickerEnum.Rooster]: 'Label_Rooster',
	[LotteryStickerEnum.Dog]: 'Label_Dog',
	[LotteryStickerEnum.Pig]: 'Label_Pig',
}
