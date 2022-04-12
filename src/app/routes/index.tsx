import { RouteObject } from 'react-router-dom'
import path from 'app/constants/paths'

import { Login } from 'app/pages/login'
import { Layout } from 'app/pages/layout'
import { UIStatePage } from 'components/UIStatePage'
import createRoutesWithMenu from './createRoutesWithMenu'
import { AuthRequire } from '../../common/auth/AuthRequire'

const routes: RouteObject[] = [
	{
		path: path.login.root,
		element: (
			<AuthRequire allowedRole>
				<Login />
			</AuthRequire>
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
			<AuthRequire allowedRole>
				<UIStatePage status={403} />
			</AuthRequire>
		),
	},
	{
		path: '*',
		element: <UIStatePage status={404} />,
	},
]

export default routes
