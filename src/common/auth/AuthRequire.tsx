import _ from 'lodash'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from 'common/hooks'

import path from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL, OLD_SITE_PREFIX_URL } from 'app/config'
import { useEffect } from 'react'

interface RequireAuthProps {
	pathMode?: typeof OLD_SITE_PREFIX_URL | typeof NEW_SITE_PREFIX_URL
	functionId?: number
	internalFunctionKey?: string
	children: JSX.Element
}

const AuthRequire = ({
	pathMode,
	functionId,
	internalFunctionKey,
	children,
}: RequireAuthProps) => {
	const {
		auth,
		onCheckSignIn,
		userMenuFunctionData,
		internalPermissionFunctionKeys,
	} = useAuth()
	const location = useLocation()

	useEffect(() => {
		onCheckSignIn()
	}, [location.pathname])

	const menuFunctionData = _.find(userMenuFunctionData, { functionId })

	const hasPermission =
		pathMode === 'Internal'
			? internalPermissionFunctionKeys?.some(key => key === internalFunctionKey)
			: _.find(menuFunctionData?.permission, {
					name: 'View',
			  })?.canUse

	if (auth.isLogin === false)
		return (
			<Navigate to={`/${path.login.root}`} state={{ from: location }} replace />
		)

	if (hasPermission === true) return children

	if (hasPermission !== undefined && hasPermission === false) {
		return <Navigate to='/403' state={{ from: location }} replace />
	}

	return children
}

export { AuthRequire }
