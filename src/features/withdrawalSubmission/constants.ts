export enum UsedCardEnum {
	ManualCard = 0,
	MemberCard = 1,
}

export const usedCardList: Array<{ value: number; displayKey: string }> = [
	{ value: UsedCardEnum.MemberCard, displayKey: 'Label_MemberCard' },
	{ value: UsedCardEnum.ManualCard, displayKey: 'Label_ManualCard' },
]

// 僅作前端判斷使用 , 實際display 參數 仍以Api 取得之結果
export enum PaymentEnum {
	Undefined,
	LocalBank,
	Crypto = 4,
}
