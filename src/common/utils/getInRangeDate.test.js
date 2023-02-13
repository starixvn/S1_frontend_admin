import { getInRangeDate } from './getInRangeDate'

test("if startDate of dateRange before the targetDate, should be '['2023-02-07T00:00:00+08:00', 'XXXXXXXXXXXXXX']'", () => {
	expect(
		getInRangeDate({
			targetDate: '2023-02-07T00:00:00',
			dateRange: ['2023-02-06T00:00:00+08:00', '2023-02-13T23:59:59+08:00'],
			timeZoneUtcOffset: 8,
		})
	).toStrictEqual(['2023-02-07T00:00:00+08:00', '2023-02-07T23:59:59+08:00'])
})

test("if startDate of dateRange after the targetDate, should be '['2023-02-07T04:00:00+08:00', 'XXXXXXXXXXXXXX']'", () => {
	expect(
		getInRangeDate({
			targetDate: '2023-02-07T00:00:00',
			dateRange: ['2023-02-07T04:00:00+08:00', '2023-02-13T23:59:59+08:00'],
			timeZoneUtcOffset: 8,
		})
	).toStrictEqual(['2023-02-07T04:00:00+08:00', '2023-02-07T23:59:59+08:00'])
})

test("if endDate of dateRange before the targetDate, should be '['XXXXXXXXXXXXXX', '2023-02-07T18:59:59+08:00'", () => {
	expect(
		getInRangeDate({
			targetDate: '2023-02-07T00:00:00',
			dateRange: ['2023-02-07T00:00:00+08:00', '2023-02-07T18:59:59+08:00'],
			timeZoneUtcOffset: 8,
		})
	).toStrictEqual(['2023-02-07T00:00:00+08:00', '2023-02-07T18:59:59+08:00'])
})

test("if endDate of dateRange after the targetDate, should be '['XXXXXXXXXXXXXX', '2023-02-07T23:59:59+08:00']'", () => {
	expect(
		getInRangeDate({
			targetDate: '2023-02-07T00:00:00',
			dateRange: ['2023-02-07T00:00:00+08:00', '2023-02-13T23:59:59+08:00'],
			timeZoneUtcOffset: 8,
		})
	).toStrictEqual(['2023-02-07T00:00:00+08:00', '2023-02-07T23:59:59+08:00'])
})
