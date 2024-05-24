import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// * 轉成時區字串
// * 例: getUtcOffsetStr(8) => '+08:00'
export const getUtcOffsetStr = (utcOffset: number) =>
	dayjs().utcOffset(utcOffset).format('Z')

export const timeZoneLocalOffset = dayjs().utcOffset() / 60

// * 轉成指定時區的格式，時間不動只改後面的時區
// * 例: utcFormatter({ date: '2024-05-16T12:34:56+08:00', utcOffset: 7 })
// * => '2024-05-16T12:34:56+07:00'
export const utcFormatter = ({
	date,
	utcOffset,
	utcOffsetStr,
}: {
	date: dayjs.Dayjs | Date | string
	utcOffset?: number
	utcOffsetStr?: string
}) =>
	dayjs(date)
		.utcOffset(utcOffset || Number(utcOffsetStr) || 0, true) // avoid NaN
		.format('YYYY-MM-DDTHH:mm:ssZ')

// * 用於處理 RangePicker 元件的時間格式
export const dateRangeToUtcFormatter = (
	dateRange?: (dayjs.Dayjs | Date)[],
	utcOffset?: number | string
) =>
	dateRange?.map(date =>
		utcFormatter({
			date,
			[typeof utcOffset === 'string' ? 'utcOffsetStr' : 'utcOffset']: utcOffset,
		})
	) ?? ['', '']
