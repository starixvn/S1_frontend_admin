export enum TransferInfoMethodEnum {
	Create = 'Create',
}

export enum TransactionTypeEnum {
	Plus = 1,
	Minus,
	FromTo,
}

export enum TransferChannelEnum {
	// 只有 PSP & CryptoWallet 在畫面上需要單獨拉出來做處理 , 其餘都ㄧ樣
	PSP = 3,
	CryptoWallet = 6,
}
