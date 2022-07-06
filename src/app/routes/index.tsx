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

const Dashboard = lazy(
	() =>
		import(
			/* webpackChunkName: 'Dashboard' */
			'features/dashboard'
		)
)

const RoleManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'RoleManagement' */ 'features/roleManagement/RoleManagement'
		)
)

const AddRoleManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'AddRoleManagement' */ 'features/roleManagement/AddRoleManagement'
		)
)

const EditRoleManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'EditRoleManagement' */ 'features/roleManagement/EditRoleManagement'
		)
)

const UserSettings = lazy(
	() =>
		import(
			/* webpackChunkName: 'UserSettings' */ 'features/userSettings/UserSettings'
		)
)

const AddUserSettings = lazy(
	() =>
		import(
			/* webpackChunkName: 'AddUserSettings' */ 'features/userSettings/AddUserSettings'
		)
)

const EditUserSettings = lazy(
	() =>
		import(
			/* webpackChunkName: 'EditUserSettings' */ 'features/userSettings/EditUserSettings'
		)
)

const AdjustmentLogReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'AdjustmentLogReport' */ 'features/adjustmentLogReport/AdjustmentLogReport'
		)
)

const BlockBankAccount = lazy(
	() =>
		import(
			/* webpackChunkName: 'BlockBankAccount' */ 'features/blockBankAccount/BlockBankAccount'
		)
)

const BlockIp = lazy(
	() => import(/* webpackChunkName: 'BlockIp' */ 'features/blockIp/BlockIp')
)

const DepositAccounting = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositAccounting' */ 'features/depositAccounting/DepositAccounting'
		)
)

const AssignBrand = lazy(
	() =>
		import(
			/* webpackChunkName: 'AssignBrand' */ 'features/assignBrand/AssignBrand'
		)
)

const ReferralManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'ReferralManagement' */ 'features/referralManagement/ReferralManagement'
		)
)

const EditReferralManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'EditReferralManagement' */ 'features/referralManagement/EditReferralManagement'
		)
)

const ReferralReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'ReferralReport' */ 'features/referralReport/ReferralReport'
		)
)

const ReferralCustReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'ReferralCustReport' */ 'features/referralReport/ReferralCustReport'
		)
)

const DepositPoint = lazy(
	() =>
		import(
			/* webpackChunkName: 'ReferralCustReport' */ 'features/depositPoint/DepositPoint'
		)
)

const InactivePointExpiry = lazy(
	() =>
		import(
			/* webpackChunkName: 'InactivePointExpiry' */ 'features/inactivePointExpiry/InactivePointExpiry'
		)
)

const VipRebateManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'VipRebateManagement' */ 'features/vipRebateManagement/VipRebateManagement'
		)
)

const RedemptionLimit = lazy(
	() =>
		import(
			/* webpackChunkName: 'RedemptionLimit' */ 'features/redemptionLimit/RedemptionLimit'
		)
)
const TurnoverPoint = lazy(
	() =>
		import(
			/* webpackChunkName: 'TurnoverPoint' */ 'features/turnoverPoint/TurnoverPoint'
		)
)

const TurnoverPointSetting = lazy(
	() =>
		import(
			/* webpackChunkName: 'TurnoverPointSetting' */ 'features/turnoverPoint/turnoverPointSetting/TurnoverPointSetting'
		)
)

const MemberList = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberList' */ 'features/memberList/MemberList'
		)
)

const MemberListLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberListLog' */ 'features/memberList/memberListLog/MemberListLog'
		)
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
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.pointSetting.sub.depositPoint.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.pointSetting.sub.depositPoint.functionId
						}
					>
						<DepositPoint />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.pointSetting.sub.inactivePointExpiry.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.pointSetting.sub.inactivePointExpiry
								.functionId
						}
					>
						<InactivePointExpiry />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.vipRebateManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.vipRebateManagement.functionId}
					>
						<VipRebateManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.redemptionLimit.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.giftManagement.sub.redemptionLimit
								.functionId
						}
					>
						<RedemptionLimit />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.pointSetting.sub.turnoverPoint.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.pointSetting.sub.turnoverPoint.functionId
						}
					>
						<TurnoverPoint />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.pointSetting.sub.turnoverPointSetting.root}/:vipLevel`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.pointSetting.sub.turnoverPointSetting
								.functionId
						}
					>
						<TurnoverPointSetting />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.memberList.root}`,
				element: (
					<AuthRequire
						functionId={paths.rewardProgram.sub.memberList.functionId}
					>
						<MemberList />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.memberList.sub.memberListLog.root}/:custId`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.memberList.sub.memberListLog.functionId
						}
					>
						<MemberListLog />
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
