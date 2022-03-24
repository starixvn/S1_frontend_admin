import { Navigate } from "react-router-dom";

import { useAuth } from "hooks";
import { useLocation } from "react-router-dom";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
	let { isLogin } = useAuth();

	let location = useLocation();

	if (isLogin === false) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};

export { RequireAuth };
