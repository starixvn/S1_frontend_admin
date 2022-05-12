import { timeZoneLocalOffset } from 'common/utils'
import { useState } from 'react'

const useTimeZone = () => {
	const [timeZoneUtcOffset, setTimeZoneUtcOffset] =
		useState(timeZoneLocalOffset)

	const onTimeZoneChange = (newUtcOffset: number) => {
		setTimeZoneUtcOffset(newUtcOffset)
	}

	return { timeZoneUtcOffset, onTimeZoneChange }
}

export { useTimeZone }
