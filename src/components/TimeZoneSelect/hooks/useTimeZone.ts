import { useState } from 'react'
import { timeZoneLocalOffset } from '../utils'

const useTimeZone = () => {
	const [timeZoneUtcOffset, setTimeZoneUtcOffset] =
		useState(timeZoneLocalOffset)

	const onTimeZoneChange = (newUtcOffset: number) => {
		setTimeZoneUtcOffset(newUtcOffset)
	}

	return { timeZoneUtcOffset, onTimeZoneChange }
}

export { useTimeZone }
