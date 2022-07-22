export enum MethodTypeEnum {
	mainWallet = 5,
	mainWalletBatch = 10,
	thirdPartyWallet = 60,
}

export const ADJUSTMENT_METHOD_TYPE_LIST: {
	value: number
	displayKey: string
}[] = [
	{ value: MethodTypeEnum.mainWallet, displayKey: 'Label_MainWallet' },
	{
		value: MethodTypeEnum.mainWalletBatch,
		displayKey: 'Label_MainWalletBatch',
	},
	{
		value: MethodTypeEnum.thirdPartyWallet,
		displayKey: 'Label_ThirdPartyWallet',
	},
]

export const AdjustmentAddTypeList: Array<{
	value: number
	displayKey: string
}> = [
	{ value: MethodTypeEnum.mainWallet, displayKey: 'Label_MainWallet' },
	{
		value: MethodTypeEnum.mainWalletBatch,
		displayKey: 'Label_MainWalletBatch',
	},
	{
		value: MethodTypeEnum.thirdPartyWallet,
		displayKey: 'Label_ThirdPartyWallet',
	},
]
