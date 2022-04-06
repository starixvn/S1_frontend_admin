import _ from 'lodash'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from 'hooks'

import { LocationState, UserAllowedRole } from 'type'
import path from 'app/constants/paths'

const RequireAuth = ({
	allowedRole,
	children,
}: {
	allowedRole: null | string | boolean
	children: JSX.Element
}) => {
	const { auth, userAllowedRoles } = useAuth()

	const location = useLocation()
	const from = (location as LocationState)?.state?.from?.pathname || '/'

	const userAllowedRole = _.find(userAllowedRoles, {
		funcKey: allowedRole,
	}) as UserAllowedRole | undefined

	if (allowedRole === true) return children

	if (auth.isLogin === false)
		return <Navigate to={`/${path.login.root}`} state={{ from }} replace />

	if (userAllowedRoles !== undefined && !userAllowedRole?.isView) {
		return <Navigate to='/403' state={{ from }} replace />
	}

	return children
}

export { RequireAuth }
