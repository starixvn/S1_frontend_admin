import { useEffect, useState } from 'react'

const useScrollPosition = () => {
	const [scrollPosition, setScrollPosition] = useState<number>()
	const el = document.getElementById('layout-content')

	useEffect(() => {
		const updatePosition = () => setScrollPosition(el?.scrollTop)

		el?.addEventListener('scroll', updatePosition)
		updatePosition()
		return () => window.removeEventListener('scroll', updatePosition)
	}, [])

	return scrollPosition
}

export { useScrollPosition }
