import { RouteObject } from "react-router-dom";
import { Layout } from "components/layout";

import { Login } from "features/login";
import { Dashboard } from "features/dashboard";
import { RequireAuth } from "components/RequireAuth";

let routes: RouteObject[] = [
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/dashboard",
				element: (
					<RequireAuth>
						<Dashboard />
					</RequireAuth>
				)
			},
			{
				path: "/nova88",
				element: (
					<RequireAuth>
						<div>dsadsa nova88</div>
					</RequireAuth>
				)
			}
		]
	},
	{
		path: "*",
		element: <div>no match</div>
	}
];

export default routes;
