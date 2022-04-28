import moment from 'moment'

export const timeZoneLocalOffset = moment.parseZone(moment()).utcOffset() / 60

export const utcFormatter = (
	date: moment.Moment | Date,
	utc: number | string
) => {
	return moment(date).utcOffset(utc).format()
}

export const dateRangeToUtcFormatter = (
	dateRange: [moment.Moment | Date, moment.Moment | Date],
	utc: number | string
) => {
	return [utcFormatter(dateRange[0], utc), utcFormatter(dateRange[1], utc)]
}
