import moment, { Moment } from 'moment'

type RangesTypes =
	| 'Today'
	| 'Yesterday'
	| 'Last Week'
	| 'Last Month'
	| 'Last 7 Day'
	| 'This Month'

type RangesType = Record<
	string,
	[moment.Moment, moment.Moment] | (() => [moment.Moment, moment.Moment])
>

export const MOMENT_DATE_RANGES: {
	[key in RangesTypes]: [Moment, Moment]
} = {
	// * 排序由近到遠
	Today: [moment().startOf('day'), moment().endOf('day')],
	Yesterday: [
		moment().subtract(1, 'day').startOf('day'),
		moment().subtract(1, 'day').endOf('day'),
	],
	'Last 7 Day': [
		moment().subtract(7, 'day').startOf('day'),
		moment().endOf('day'),
	],
	'Last Week': [
		moment().subtract(1, 'week').startOf('week'),
		moment().subtract(1, 'week').endOf('week'),
	],
	'This Month': [moment().startOf('month'), moment().endOf('month')],
	'Last Month': [
		moment().subtract(1, 'month').startOf('month'),
		moment().subtract(1, 'month').endOf('month'),
	],
}

export const MOMENT_RANGE_PICKER_RANGES = (rangesTypes: RangesTypes[]) => {
	const ranges: RangesType = {}

	Object.keys(MOMENT_DATE_RANGES).forEach(key => {
		if (rangesTypes.some(rangesType => rangesType === key)) {
			ranges[key as RangesTypes] = MOMENT_DATE_RANGES[key as RangesTypes]
		}
	})

	return ranges
}
