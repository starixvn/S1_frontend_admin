export enum OTPStatusEnum {
	SendToProvider = 1,
	SendToCustomer,
	CustomerVerified,
	Fail,
}

export const OTP_STATUS_OPTIONS: { value: number; name: string }[] = [
	{
		value: OTPStatusEnum.SendToProvider,
		name: 'SendToProvider',
	},
	{
		value: OTPStatusEnum.SendToCustomer,
		name: 'SendToCustomer',
	},
	{
		value: OTPStatusEnum.CustomerVerified,
		name: 'CustomerVerified',
	},
	{
		value: OTPStatusEnum.Fail,
		name: 'Fail',
	},
]
