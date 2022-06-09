import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import paths from 'app/constants/paths'
import { Iframe } from 'components'
import { Login } from 'app/pages/login'
import { Layout } from 'app/pages/layout'
import { UIStatePage } from 'components/UIStatePage'
import { MenMappingInterface, MENU_MAPPING } from 'app/constants/menuMapping'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { InternalAuthRequire } from 'common/auth'
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

const BlockBankAccount = lazy(
	() => import('features/blockBankAccount/BlockBankAccount')
)

const BlockIp = lazy(() => import('features/blockIp/BlockIp'))

const DepositAccounting = lazy(
	() => import('features/depositAccounting/DepositAccounting')
)

const AssignBrand = lazy(() => import('features/assignBrand/AssignBrand'))

const ReferralManagement = lazy(
	() => import('features/referralManagement/ReferralManagement')
)

const EditReferralManagement = lazy(
	() => import('features/referralManagement/EditReferralManagement')
)

const ReferralReport = lazy(
	() => import('features/referralReport/ReferralReport')
)

const ReferralCustReport = lazy(
	() => import('features/referralReport/ReferralCustReport')
)
const routesWithMenu: RouteObject[] = MENU_MAPPING.filter(
	({ pathMode, element }) => pathMode === 'Internal' || Boolean(element)
).map(
	({
		internalPath,
		internalFunctionKey,
		index,
		pathMode,
	}: MenMappingInterface) => ({
		...(index
			? { index }
			: {
					path: `${pathMode}/${internalPath}`,
			  }),
		element: (
			<InternalAuthRequire internalFunctionKey={internalFunctionKey}>
				<Iframe path={internalPath ?? ''} />
			</InternalAuthRequire>
		),
	})
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
					<AuthRequire>
						<div />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.dashboard.root}`,
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
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.risk.sub.blockBankAccount.root}`,
				element: (
					<AuthRequire functionId={paths.risk.sub.blockBankAccount.functionId}>
						<BlockBankAccount />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.risk.sub.blockIp.root}`,
				element: (
					<AuthRequire functionId={paths.risk.sub.blockIp.functionId}>
						<BlockIp />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.accounting.sub.depositAccounting.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.accounting.sub.depositAccounting.functionId
						}
					>
						<DepositAccounting />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.assignBrand.root}`,
				element: (
					<AuthRequire>
						<AssignBrand />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.referralManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.referralManagement.functionId}
					>
						<ReferralManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.editReferralManagement.root}/:editCurrencyId`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.editReferralManagement.functionId}
					>
						<EditReferralManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.referralReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.referralReport.functionId}
					>
						<ReferralReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.referralCustReport.root}/:custId`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.referralCustReport.functionId}
					>
						<ReferralCustReport />
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
