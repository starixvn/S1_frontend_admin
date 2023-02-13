import { utcFormatter } from 'common/utils'
import moment from 'moment'

/**
 * 根據 `settledDate` 的 `起始時間`與 `結束時間` 比對 指定的 `dateRange` 來取得正確時間
 */
const getInRangeDate = ({
	targetDate,
	dateRange,
	timeZoneUtcOffset,
}: {
	targetDate: string
	dateRange: [string, string]
	timeZoneUtcOffset: number
}) => {
	const targetStartDate = utcFormatter({
		date: moment(targetDate).startOf('day'),
		utcOffset: timeZoneUtcOffset,
	})

	const targetEndDate = utcFormatter({
		date: moment(targetDate).endOf('day'),
		utcOffset: timeZoneUtcOffset,
	})

	const startDate = moment(targetStartDate).isSameOrAfter(dateRange[0])
		? targetStartDate
		: dateRange[0]

	const endDate = moment(targetEndDate).isSameOrBefore(dateRange[1])
		? targetEndDate
		: dateRange[1]

	return [startDate, endDate]
}

export { getInRangeDate }
