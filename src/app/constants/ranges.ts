import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { TimeRangePickerProps } from 'antd'

dayjs.extend(utc)

type DateRange = [dayjs.Dayjs, dayjs.Dayjs]

type TimeFrame =
	| 'Today'
	| 'Yesterday'
	| 'Last Week'
	| 'Last Month'
	| 'Last 7 Day'
	| 'This Month'

type RangesType = Record<string, DateRange | (() => DateRange)>

const now = dayjs()

export const DATE_RANGES: RangesType = {
	// * 排序由近到遠
	Today: [now.startOf('day'), now.endOf('day')],
	Yesterday: [
		now.subtract(1, 'day').startOf('day'),
		now.subtract(1, 'day').endOf('day'),
	],
	'Last 7 Day': [now.subtract(7, 'day').startOf('day'), now.endOf('day')],
	'Last Week': [
		now.subtract(1, 'week').startOf('week'),
		now.subtract(1, 'week').endOf('week'),
	],
	'This Month': [now.startOf('month'), now.endOf('month')],
	'Last Month': [
		now.subtract(1, 'month').startOf('month'),
		now.subtract(1, 'month').endOf('month'),
	],
}

/**
 * @deprecated 請使用 `presets` 代替 `ranges`。
 * `ranges` 属性已被棄用，請使用 `presets` 替代。
 *  @RANGE_PICKER_PRESETS 請引入同隻檔案的函數。  */
export const RANGE_PICKER_RANGES = (timeFrames: TimeFrame[]) => {
	const ranges: RangesType = {}

	Object.keys(DATE_RANGES).forEach(key => {
		if (timeFrames.some(timeFrame => timeFrame === key)) {
			ranges[key] = DATE_RANGES[key]
		}
	})

	return ranges
}

/**
 * 請使用此函數取代 RANGE_PICKER_RANGES 函數
 * `ranges` 属性已被棄用，请使用 `presets` 替代。
 * @example
 * <RangePicker
 *	 style={{ width: '100%' }}
 *	 presets={RANGE_PICKER_PRESETS([
 * 			'Today',
 *				'Yesterday',
 *				'Last Week',
 *				'This Month',
 *				'Last Month'
 *				])}
 *	 format={dateFormat}
 *	 disabledDate={disabledDate}
 * /> */
export const RANGE_PICKER_PRESETS = (timeFrames: TimeFrame[]) => {
	const rangePresets: TimeRangePickerProps['presets'] = []

	Object.entries(DATE_RANGES).forEach(([key, range]) => {
		if (timeFrames.some(timeFrame => timeFrame === key)) {
			rangePresets.push({
				label: key,
				value: range,
			})
		}
	})

	return rangePresets
}
