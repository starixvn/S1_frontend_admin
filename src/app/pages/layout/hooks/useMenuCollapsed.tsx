import paths from 'app/constants/paths'
import { useState } from 'react'

// * 指定頁面將初始菜單收合起來
const initCollapsedByPaths = (collapsedPaths: string[]) => {
	return collapsedPaths.some(collapsedPath =>
		window.location.pathname.match(collapsedPath)
	)
}

const useMenuCollapsed = () => {
	const [collapsed, setCollapsed] = useState<boolean>(
		initCollapsedByPaths([paths.memberProfile.root])
	)

	const onToggleCollapsed = () => {
		setCollapsed(prev => !prev)
	}

	const onCloseCollapsed = () => {
		setCollapsed(true)
	}

	return { collapsed, onToggleCollapsed, onCloseCollapsed }
}

export { useMenuCollapsed }
