import _ from 'lodash'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from 'common/hooks'
import { LocationState, UserAllowedRole } from 'type'
import path from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL, OLD_SITE_PREFIX_URL } from 'app/config'

interface RequireAuthProps {
	allowedRole: null | string | boolean
	children: JSX.Element
}

const AuthRequire = ({ allowedRole, children }: RequireAuthProps) => {
	const { auth, userAllowedRoles } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	const from = (location as LocationState)?.state?.from?.pathname || '/'

	// useEffect(() => {
	// 	navigate(`${location.pathname}${location.search}`, {

	// 	})
	// }, [location.pathname])

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

export { AuthRequire }
