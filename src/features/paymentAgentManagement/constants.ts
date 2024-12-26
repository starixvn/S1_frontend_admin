export const PaymentAgentTypeEnum = {
	Internal: 0,
	OutSource: 1,
} as const

export const PAYMENT_AGENT_TYPE_LIST = [
	{
		value: PaymentAgentTypeEnum.Internal,
		displayName: 'Label_Internal',
	},
	{
		value: PaymentAgentTypeEnum.OutSource,
		displayName: 'Label_OutSource',
	},
]

export const groupIdMap: Record<number, string> = {
	1: 'Deposit',
	2: 'Withdrawal',
	// 3: 'Something else', etc.
}
