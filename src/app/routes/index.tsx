import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import paths from 'app/constants/paths'
import { Iframe } from 'components/Iframe'
import { Login } from 'app/pages/login'
import { Layout } from 'app/pages/layout'
import { UIStatePage } from 'components/UIStatePage'
import { MenMappingInterface, MENU_MAPPING } from 'app/constants/menuMapping'
import { NEW_SITE_PREFIX_URL } from 'app/config'

import { AuthRequire } from '../../common/auth/AuthRequire'

const AddRoleManagement = lazy(
	() => import('features/roleManagement/AddRoleManagement')
)

const routesWithMenu: RouteObject[] = MENU_MAPPING.filter(({ pathMode }) =>
	Boolean(pathMode)
).map(
	({
		internalPath,
		newAdminPath,
		functionId,
		internalFunctionKey,
		index,
		pathMode,
		element: originElement,
	}: MenMappingInterface) => {
		if (pathMode === 'Internal')
			return {
				...(index
					? { index }
					: {
							path: `${pathMode}/${internalPath}`,
					  }),
				element: (
					<AuthRequire
						pathMode={pathMode}
						functionId={Number(functionId)}
						internalFunctionKey={internalFunctionKey}
					>
						<Iframe path={internalPath ?? ''} />
					</AuthRequire>
				),
			}

		const element = originElement as JSX.Element

		return {
			...(index
				? { index }
				: {
						path: `${pathMode}/${newAdminPath}`,
				  }),
			element: (
				<AuthRequire
					pathMode={pathMode}
					functionId={Number(functionId)}
					internalFunctionKey={internalFunctionKey}
				>
					{element}
				</AuthRequire>
			),
		}
	}
)

const routes: RouteObject[] = [
	{
		path: paths.login.root,
		element: <Login />,
	},
	{
		path: paths.layout.root,
		element: <Layout />,
		children: [
			...routesWithMenu,
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.addRoleManagement.root}`,
				element: (
					<AuthRequire>
						<AddRoleManagement />
					</AuthRequire>
				),
			},
		],
	},
	{
		path: '/403',
		element: <UIStatePage status={403} />,
	},
	{
		path: '*',
		element: <UIStatePage status={404} />,
	},
]

export default routes
