export enum StatusEnum {
	Running = 1,
	Canceled,
	Expiry,
	Fulfill,
	TransferOut,
}

export const STATUS_TYPE_OPTIONS = [
	{
		displayKey: 'BonusReportStatuses.Label_Running',
		value: StatusEnum.Running,
	},
	{
		displayKey: 'BonusReportStatuses.Label_Canceled',
		value: StatusEnum.Canceled,
	},
	{
		displayKey: 'BonusReportStatuses.Label_Expiry',
		value: StatusEnum.Expiry,
	},
	{
		displayKey: 'BonusReportStatuses.Label_Fulfill',
		value: StatusEnum.Fulfill,
	},
	{
		displayKey: 'BonusReportStatuses.Label_TransferOut',
		value: StatusEnum.TransferOut,
	},
]
