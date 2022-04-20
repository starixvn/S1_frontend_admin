import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useResetScrollBar = (ref: any) => {
	const { pathname } = useLocation()

	useEffect(() => {
		if (ref) {
			ref.scrollTo({
				top: 0,
				behavior: 'smooth',
			})
		}
	}, [pathname])
}

export { useResetScrollBar }
