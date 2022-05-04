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

const Dashboard = lazy(() => import('features/dashboard'))

const RoleManagement = lazy(
	() => import('features/roleManagement/RoleManagement')
)

const AddRoleManagement = lazy(
	() => import('features/roleManagement/AddRoleManagement')
)

const EditRoleManagement = lazy(
	() => import('features/roleManagement/EditRoleManagement')
)

const UserSettings = lazy(() => import('features/userSettings/UserSettings'))

const AddUserSettings = lazy(
	() => import('features/userSettings/AddUserSettings')
)

const EditUserSettings = lazy(
	() => import('features/userSettings/EditUserSettings')
)

const AdjustmentLogReport = lazy(
	() => import('features/adjustmentLogReport/AdjustmentLogReport')
)

const routesWithMenu: RouteObject[] = MENU_MAPPING.filter(
	({ pathMode, element }) => pathMode === 'Internal' || Boolean(element)
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
				index: true,
				element: (
					<AuthRequire functionId={paths.dashboard.functionId}>
						<Dashboard />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.roleManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.administration.sub.roleManagement.functionId}
					>
						<RoleManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.addRoleManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.administration.sub.addRoleManagement.functionId}
					>
						<AddRoleManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.editRoleManagement.root}/:roleId`,
				element: (
					<AuthRequire
						functionId={paths.administration.sub.editRoleManagement.functionId}
					>
						<EditRoleManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.userSetting.root}`,
				element: (
					<AuthRequire
						functionId={paths.administration.sub.userSetting.functionId}
					>
						<UserSettings />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.addUserSetting.root}`,
				element: (
					<AuthRequire
						functionId={paths.administration.sub.addUserSetting.functionId}
					>
						<AddUserSettings />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.editUserSetting.root}/:userId`,
				element: (
					<AuthRequire
						functionId={paths.administration.sub.editUserSetting.functionId}
					>
						<EditUserSettings />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.adjustmentLogReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.administration.sub.adjustmentLogReport.functionId}
					>
						<AdjustmentLogReport />
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
