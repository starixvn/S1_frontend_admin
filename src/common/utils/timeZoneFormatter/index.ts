import moment from 'moment'
import mt from 'moment-timezone'
import ct from 'countries-and-timezones'
import { find, isString } from 'lodash'

// * ct.getAllTimezones() 會拿到所有國家的時區資訊
const allTimezones = ct.getAllTimezones()

export const timeZoneLocalOffset = moment.parseZone(moment()).utcOffset() / 60

// * 轉成指定時區的格式
export const utcFormatter = ({
	date,
	utcOffset,
	utcOffsetStr,
}: {
	date: moment.Moment | Date
	utcOffset?: number
	utcOffsetStr?: string
}) => {
	let timezone: ct.Timezone

	if (utcOffsetStr) {
		timezone = find(allTimezones, { utcOffsetStr }) as ct.Timezone
	} else {
		timezone = find(allTimezones, {
			utcOffset: Number(utcOffset) * 60,
		}) as ct.Timezone
	}

	// * 將被扣掉的時差加回來，以符合後端格式需求
	// * ex: utcFormatter('2022-07-20T00:00:00+08:00', 7)
	// * 2022-07-20T00:00:00+08:00 => 2022-07-20T00:00:00+07:00 時間不動只改後面的時區
	const formatDate = moment(date)
		.utcOffset(0, true)
		.subtract(timezone.utcOffset / 60, 'hour')

	return mt.tz(formatDate, timezone.name).format()
}

// * 用於處理 RangePicker 元件的時間格式
export const dateRangeToUtcFormatter = (
	dateRange: [moment.Moment | Date, moment.Moment | Date],
	utc?: number | string
) => {
	return [
		utcFormatter({
			date: dateRange[0],
			[isString(utc) ? 'utcOffsetStr' : 'utcOffset']: utc,
		}),
		utcFormatter({
			date: dateRange[1],
			[isString(utc) ? 'utcOffsetStr' : 'utcOffset']: utc,
		}),
	]
}
