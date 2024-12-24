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
