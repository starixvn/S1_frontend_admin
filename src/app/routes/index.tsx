import createRoutesWithMenu from "./createRoutesWithMenu";
import { RouteObject } from "react-router-dom";
import path from "app/constants/paths";

import { Login, Layout } from "app/pages";
import { UIStatePage } from "components/UIStatePage";
import { RequireAuth } from "./RequireAuth";

let routes: RouteObject[] = [
	{
		path: path.login.root,
		element: (
			<RequireAuth allowedRole={true}>
				<Login />
			</RequireAuth>
		)
	},
	{
		path: path.layout.root,
		element: <Layout />,
		children: createRoutesWithMenu()
	},
	{
		path: "/403",
		element: (
			<RequireAuth allowedRole={true}>
				<UIStatePage status={403} />
			</RequireAuth>
		)
	},
	{
		path: "*",
		element: <UIStatePage status={404} />
	}
];

export default routes;
