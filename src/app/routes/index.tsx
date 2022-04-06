import { RouteObject } from 'react-router-dom'
import path from 'app/constants/paths'

import { Login, Layout } from 'app/pages'
import { UIStatePage } from 'components/UIStatePage'
import createRoutesWithMenu from './createRoutesWithMenu'
import { RequireAuth } from './RequireAuth'

const routes: RouteObject[] = [
	{
		path: path.login.root,
		element: (
			<RequireAuth allowedRole>
				<Login />
			</RequireAuth>
		),
	},
	{
		path: path.layout.root,
		element: <Layout />,
		children: createRoutesWithMenu(),
	},
	{
		path: '/403',
		element: (
			<RequireAuth allowedRole>
				<UIStatePage status={403} />
			</RequireAuth>
		),
	},
	{
		path: '*',
		element: <UIStatePage status={404} />,
	},
]

export default routes
