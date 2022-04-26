import { resetScrollBar } from 'common/utils'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useResetScrollBar = (ref: any) => {
	const { pathname } = useLocation()

	useEffect(() => {
		if (ref) {
			resetScrollBar(ref)
		}
	}, [pathname])
}

export { useResetScrollBar }
