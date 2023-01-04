import moment, { Moment } from 'moment'

type RangesTypes = 'Today' | 'Last 7 Day' | 'This Month'

type RangesType = Record<
	string,
	[moment.Moment, moment.Moment] | (() => [moment.Moment, moment.Moment])
>

export const MOMENT_DATE_RANGES: {
	[key in RangesTypes]: [Moment, Moment]
} = {
	Today: [moment().startOf('day'), moment().endOf('day')],
	'Last 7 Day': [
		moment().subtract(7, 'day').startOf('day'),
		moment().endOf('day'),
	],
	'This Month': [moment().startOf('month'), moment().endOf('month')],
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
