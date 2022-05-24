import _ from 'lodash'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from 'common/hooks'
import paths from 'app/constants/paths'
import { cloneElement, useEffect } from 'react'
import { getActionPermissions } from 'common/utils'

interface RequireAuthProps {
	functionId?: number
	children: JSX.Element
}

const AuthRequire = ({ functionId, children }: RequireAuthProps) => {
	const { auth, onCheckSignIn, userMenuFunctionData, setActionPermissions } =
		useAuth()
	const location = useLocation()
	const menuFunctionData = _.find(userMenuFunctionData, { functionId })

	useEffect(() => {
		onCheckSignIn()
	}, [location.pathname])

	useEffect(() => {
		const newActionPermissions = getActionPermissions(
			menuFunctionData?.permission ?? []
		)

		setActionPermissions(newActionPermissions)
	}, [menuFunctionData?.functionId])

	const hasPermission = _.find(menuFunctionData?.permission, {
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

	return cloneElement(children, {
		pageTitle: menuFunctionData?.name,
	})
}

export { AuthRequire }
