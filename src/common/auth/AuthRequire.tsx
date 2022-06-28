import { find } from 'lodash'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from 'common/hooks'
import paths from 'app/constants/paths'
import { cloneElement, useEffect } from 'react'
import { getActionPermissions } from 'common/utils'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

interface RequireAuthProps {
	functionId?: number
	children: JSX.Element
}

const AuthRequire = ({ functionId, children }: RequireAuthProps) => {
	const { auth, onCheckSignIn, userMenuFunctionData, setActionPermissions } =
		useAuth()
	const location = useLocation()
	const menuFunctionData = find(userMenuFunctionData, { functionId })
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	useEffect(() => {
		onCheckSignIn()
	}, [location.pathname])

	useEffect(() => {
		const newActionPermissions = getActionPermissions(
			menuFunctionData?.permission ?? []
		)

		setActionPermissions(newActionPermissions)
	}, [menuFunctionData?.functionId])

	const hasPermission = find(menuFunctionData?.permission, {
		name: 'View',
	})?.canUse

	if (auth.isLogin === false)
		return (
			<Navigate
				to={`/${paths.login.root}`}
				state={{ from: location }}
				replace
			/>
		)

	if (hasPermission !== undefined && hasPermission === false) {
		return <Navigate to='/403' state={{ from: location }} replace />
	}

	// 如果沒有選擇品牌，不顯示內容
	if (!siteId) return null

	return cloneElement(children, {
		pageTitle: menuFunctionData?.name,
	})
}

export { AuthRequire }
