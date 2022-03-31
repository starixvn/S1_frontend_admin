import _ from "lodash";
import { Navigate } from "react-router-dom";
import { useAuth } from "hooks";
import { useLocation } from "react-router-dom";
import { LocationState, UserAllowedRole } from "type";
import path from "app/constants/paths";

const RequireAuth = ({
	allowedRole,
	children
}: {
	allowedRole?: null | string | boolean;
	children: JSX.Element;
}) => {
	let { auth, userAllowedRoles } = useAuth();

	let location = useLocation();
	let from = (location as LocationState)?.state?.from?.pathname || "/";

	const userAllowedRole = _.find(userAllowedRoles, {
		funcKey: allowedRole
	}) as UserAllowedRole | undefined;

	if (allowedRole === true) return children;

	if (auth.isLogin === false)
		return <Navigate to={`/${path.login.root}`} state={{ from }} replace />;

	if (userAllowedRoles !== undefined && !userAllowedRole?.isView) {
		return <Navigate to="/403" state={{ from }} replace />;
	}

	return children;
};

export { RequireAuth };
