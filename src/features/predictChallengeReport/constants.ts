export const PredictStatusEnum = {
	Running: 0,
	Loss: 1,
	Win: 2,
} as const

export const PREDICT_STATUS_OPTIONS: { value: number; displayName: string }[] =
	[
		{ value: PredictStatusEnum.Running, displayName: 'Label_Running' },
		{ value: PredictStatusEnum.Loss, displayName: 'Label_Loss' },
		{
			value: PredictStatusEnum.Win,
			displayName: 'Label_Win',
		},
	]
