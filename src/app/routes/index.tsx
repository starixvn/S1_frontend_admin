import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import paths from 'app/constants/paths'
import { Iframe } from 'components'
import { Login } from 'app/pages/login'
import { Layout } from 'app/pages/layout'
import { UIStatePage } from 'components/UIStatePage'
import { MenMappingInterface, MENU_MAPPING } from 'app/constants/menuMapping'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { InternalAuthRequire, AuthRequire } from 'common/auth'

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
const BetList = lazy(
	() => import(/* webpackChunkName: 'BetList' */ 'features/betList/BetList')
)

const GiftListing = lazy(
	() =>
		import(
			/* webpackChunkName: 'RedemptionLimit' */ 'features/giftListing/GiftListing'
		)
)

const AddGiftListing = lazy(
	() =>
		import(
			/* webpackChunkName: 'RedemptionLimit' */ 'features/giftListing/AddGiftListing'
		)
)

const EditGiftListing = lazy(
	() =>
		import(
			/* webpackChunkName: 'RedemptionLimit' */ 'features/giftListing/EditGiftListing'
		)
)

const WorldCupTeamReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'WorldCupTeamReport' */ 'features/worldCupTeamReport/WorldCupTeamReport'
		)
)

const WorldCupMemberReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'WorldCupMemberReport' */ 'features/worldCupMemberReport/WorldCupMemberReport'
		)
)

const WorldCupMemberSetting = lazy(
	() =>
		import(
			/* webpackChunkName: 'WorldCupMemberSetting' */ 'features/worldCupSetting/WorldCupSetting'
		)
)
const RedemptionListing = lazy(
	() =>
		import(
			/* webpackChunkName: 'RedemptionListing' */ 'features/redemptionListing/RedemptionListing'
		)
)

const RedemptionDetail = lazy(
	() =>
		import(
			/* webpackChunkName: 'RedemptionDetail' */ 'features/redemptionListing/redemptionDetail/RedemptionDetail'
		)
)

const SiteMaintenance = lazy(
	() =>
		import(
			/* webpackChunkName: 'SiteMaintenance' */ 'features/siteMaintenance/SiteMaintenance'
		)
)

const AdjustmentPointReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'adjustmentPointReport' */ 'features/adjustmentPointReport/AdjustmentPointReport'
		)
)

const DepositPointReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'depositPointReport' */ 'features/depositPointReport/DepositPointReport'
		)
)

const BlockEWallet = lazy(
	() =>
		import(
			/* webpackChunkName: 'BlockEWallet' */ 'features/blockEWallet/BlockEWallet'
		)
)

const SpecialPasswordManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'SpecialPasswordManagement' */ 'features/specialPasswordManagement/SpecialPasswordManagement'
		)
)

const EWalletSetting = lazy(
	() =>
		import(
			/* webpackChunkName: 'EWalletSetting' */ 'features/eWalletSetting/EWalletSetting'
		)
)

const BalanceAdjustment = lazy(
	() =>
		import(
			/* webpackChunkName: 'BalanceAdjustment' */ 'features/balanceAdjustment'
		)
)

const VerificationReward = lazy(
	() =>
		import(
			/* webpackChunkName: 'VerificationManagement' */ 'features/verificationManagement/VerificationManagement'
		)
)
const TurnoverPointReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'TurnoverPointReport' */ 'features/turnoverPointReport/TurnoverPointReport'
		)
)

const TransferAccountManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'TransferAccountManagement' */ 'features/transferAccountManagement/TransferAccountManagement'
		)
)

const SnsManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'SnsManagement' */ 'features/snsManagement/SnsManagement'
		)
)
const BonusExport = lazy(
	() =>
		import(
			/* webpackChunkName: 'BonusExport' */ 'features/bonusExport/BonusExport'
		)
)

const LineDepositChannel = lazy(
	() =>
		import(
			/* webpackChunkName: 'LineDepositChannel' */ 'features/lineDepositChannel/LineDepositChannel'
		)
)

const WithdrawalSubmission = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalSubmission' */ 'features/withdrawalSubmission/WithdrawalSubmission'
		)
)
const BankCardManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'BankCardManagement' */ 'features/bankCardManagement/BankCardManagement'
		)
)

const LiveRegistrationStatistics = lazy(
	() =>
		import(
			/* webpackChunkName: 'LiveRegistrationStatistics' */ 'features/liveRegistrationStatistics/LiveRegistrationStatistics'
		)
)

const WithdrawalLimitation = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalLimitation' */ 'features/withdrawalLimitation/WithdrawalLimitation'
		)
)

const DepositLimitation = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositLimitation' */ 'features/depositLimitation/DepositLimitation'
		)
)

const BonusManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'BonusManagement' */ 'features/bonusManagement/BonusManagement'
		)
)

const BonusManagementUpdateBonus = lazy(
	() =>
		import(
			/* webpackChunkName: 'UpdateBonus' */ 'features/bonusManagement/editBonusDetail/UpdateBonus'
		)
)

const BonusManagementScratchCardList = lazy(
	() =>
		import(
			/* webpackChunkName: 'ScratchCardList' */ 'features/bonusManagement/scratchCardList/ScratchCardList'
		)
)

const SlotGameCategory = lazy(
	() =>
		import(
			/* webpackChunkName: 'SlotGameCategory' */ 'features/slotGameCategory/SlotGameCategory'
		)
)

const HotEventManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'HotEventManagement' */ 'features/hotEventManagement/HotEventManagement'
		)
)

const HotEventEdit = lazy(
	() =>
		import(
			/* webpackChunkName: 'HotEventEdit' */ 'features/hotEventManagement/editHotEvent/EditHotEvent'
		)
)

const IssueBonusManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'IssueBonusManagement' */ 'features/issueBonusManagement/IssueBonusManagement'
		)
)

const WithdrawalKycControl = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalKycControl' */ 'features/withdrawalKycControl/WithdrawalKycControl'
		)
)

const WithdrawalAdjustment = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalAdjustment' */ 'features/withdrawalAdjustment/WithdrawalAdjustment'
		)
)

const AdjustmentLimitation = lazy(
	() =>
		import(
			/* webpackChunkName: 'AdjustmentLimitation' */ 'features/adjustmentLimitation/AdjustmentLimitation'
		)
)

const BonusReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'BonusReport' */ 'features/bonusReport/BonusReport'
		)
)

const TransferInfoManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'TransferInfoManagement' */ 'features/transferInfoManagement/TransferInfoManagement'
		)
)

const TransferInfoEdit = lazy(
	() =>
		import(
			/* webpackChunkName: 'TransferInfoEdit' */ 'features/transferInfoManagement/editTransferInfo/EditTransferInfo'
		)
)

const ReasonManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'ReasonManagement' */ 'features/reasonManagement/ReasonManagement'
		)
)

const MemberProfile = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/MemberProfile'
		)
)

// *  MemberProfile > Dashboard
const MemberProfileDashboard = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/dashboard/Dashboard'
		)
)

// *  MemberProfile > CustomerInfo 類別
const MemberProfileCustomerInfoMemberFlowLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/customerInfo/memberFlowLog/MemberFlowLog'
		)
)

// *  MemberProfile > Finance 類別
const MemberProfileFinanceDepositInfo = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/depositInfo/DepositInfo'
		)
)

// *  MemberProfile > Game 類別
const MemberProfileGameStatement = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/game/statement/Statement'
		)
)

// *  MemberProfile > Marketing 類別
const MemberProfileMarketingBonusWallet = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/marketing/bonusWallet/BonusWallet'
		)
)

// *  MemberProfile > Setting
const MemberProfileSetting = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/setting/Setting'
		)
)

// *  MemberProfile > AdminUserLog
const MemberProfileAdminUserLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/adminUserLog/AdminUserLog'
		)
)

const MemberProfileVipLevelLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'VipLevelLog' */ 'features/memberProfile/pages/customerInfo/vipLevelLog/VipLevelLog'
		)
)

const MemberProfileReferralHistory = lazy(
	() =>
		import(
			/* webpackChunkName: 'ReferralHistory' */ 'features/memberProfile/pages/customerInfo/referralHistory/ReferralHistory'
		)
)

const MemberProfileNotes = lazy(
	() =>
		import(
			/* webpackChunkName: 'CustomerNotes' */ 'features/memberProfile/pages/customerInfo/customerNotes/CustomerNotes'
		)
)

const MemberProfileLoginLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'LoginLog' */ 'features/memberProfile/pages/customerInfo/loginLog/LoginLog'
		)
)

const MemberProfileSmsInfo = lazy(
	() =>
		import(
			/* webpackChunkName: 'SmsInfo' */ 'features/memberProfile/pages/customerInfo/smsInfo/SmsInfo'
		)
)

const MemberProfileDeviceList = lazy(
	() =>
		import(
			/* webpackChunkName: 'DeviceList' */ 'features/memberProfile/pages/customerInfo/deviceList/DeviceList'
		)
)

const MemberProfileIpList = lazy(
	() =>
		import(
			/* webpackChunkName: 'IpList' */ 'features/memberProfile/pages/customerInfo/IpList/IpList'
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
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.giftListing.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.giftManagement.sub.giftListing.functionId
						}
					>
						<GiftListing />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.addGiftListing.root}/:currencyId`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.giftManagement.sub.giftListing.functionId
						}
					>
						<AddGiftListing />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.editGiftListing.root}/:currencyId/:editGiftId`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.giftManagement.sub.giftListing.functionId
						}
					>
						<EditGiftListing />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.betList.root}`,
				element: (
					<AuthRequire functionId={paths.report.sub.betList.functionId}>
						<BetList />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.worldCupTeamReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.worldCupTeamReport.functionId}
					>
						<WorldCupTeamReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.worldCupMemberReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.worldCupMemberReport.functionId}
					>
						<WorldCupMemberReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.worldCupSetting.root}`,
				element: (
					<AuthRequire functionId={paths.cms.sub.worldCupSetting.functionId}>
						<WorldCupMemberSetting />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.redemptionListing.root}`,
				element: (
					<AuthRequire
						functionId={paths.rewardProgram.sub.redemptionListing.functionId}
					>
						<RedemptionListing />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.redemptionDetail.root}/:redemptionId`,
				element: (
					<AuthRequire
						functionId={paths.rewardProgram.sub.redemptionDetail.functionId}
					>
						<RedemptionDetail />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.siteMaintenance.root}`,
				element: (
					<AuthRequire functionId={paths.cms.sub.siteMaintenance.functionId}>
						<SiteMaintenance />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.report.sub.adjustmentPointReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.report.sub.adjustmentPointReport
								.functionId
						}
					>
						<AdjustmentPointReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.report.sub.depositPointReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.report.sub.depositPointReport.functionId
						}
					>
						<DepositPointReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.blockEWallet.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.blockEWallet.functionId}>
						<BlockEWallet />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.administration.sub.specialPasswordManagement.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.administration.sub.specialPasswordManagement.functionId
						}
					>
						<SpecialPasswordManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.eWalletSetting.root}`,
				element: (
					<AuthRequire
						functionId={paths.finance.sub.setting.sub.eWalletSetting.functionId}
					>
						<EWalletSetting />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.report.sub.depositPointReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.report.sub.depositPointReport.functionId
						}
					>
						<DepositPointReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.adjustment.sub.balanceAdjustment.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.adjustment.sub.balanceAdjustment.functionId
						}
					>
						<BalanceAdjustment />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.verificationRewardManagement.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.marketing.sub.verificationRewardManagement.functionId
						}
					>
						<VerificationReward />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.report.sub.turnoverPointReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.rewardProgram.sub.report.sub.turnoverPointReport.functionId
						}
					>
						<TurnoverPointReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.transferAccountManagement.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.bankTransfer.sub.transferAccountManagement.functionId
						}
					>
						<TransferAccountManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.urlManagement.sub.snsManagement.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.cms.sub.urlManagement.sub.snsManagement.functionId
						}
					>
						<SnsManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.rewardBonusExport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.rewardBonusExport.functionId}
					>
						<BonusExport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.urlManagement.sub.lineDepositChannel.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.cms.sub.urlManagement.sub.lineDepositChannel.functionId
						}
					>
						<LineDepositChannel />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.withdrawalSubmission.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.depositWithdrawalSector.sub.withdrawalSubmission
								.functionId
						}
					>
						<WithdrawalSubmission />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.bankAccManagement.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.setting.sub.bankAccManagement.functionId
						}
					>
						<BankCardManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.operatorService.sub.liveRegistrationStatistics.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.customerSupport.sub.operatorService.sub
								.liveRegistrationStatistics.functionId
						}
					>
						<LiveRegistrationStatistics />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.withdrawalLimitation.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.setting.sub.withdrawalLimitation.functionId
						}
					>
						<WithdrawalLimitation />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.bonusManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.bonusManagement.functionId}
					>
						<BonusManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.bonusManagement.root}/:bonusCode`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.bonusManagement.functionId}
					>
						<BonusManagementUpdateBonus />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.bonusManagement.root}/scratchCard/:specialCode`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.bonusManagement.functionId}
					>
						<BonusManagementScratchCardList />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.depositLimitation.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.setting.sub.depositLimitation.functionId
						}
					>
						<DepositLimitation />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.productManagement.sub.slotGameCategory.root}`,
				element: (
					<AuthRequire
						functionId={paths.productManagement.sub.slotGameCategory.functionId}
					>
						<SlotGameCategory />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.issueBonusManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.finance.sub.issueBonusManagement.functionId}
					>
						<IssueBonusManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.hotEventManagement.root}`,
				element: (
					<AuthRequire functionId={paths.cms.sub.hotEventManagement.functionId}>
						<HotEventManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.hotEventManagement.root}/:id`,
				element: (
					<AuthRequire functionId={paths.cms.sub.hotEventManagement.functionId}>
						<HotEventEdit />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.withdrawalKycControl.root}`,
				element: (
					<AuthRequire
						functionId={paths.finance.sub.withdrawalKycControl.functionId}
					>
						<WithdrawalKycControl />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.adjustmentLimitation.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.setting.sub.adjustmentLimitation.functionId
						}
					>
						<AdjustmentLimitation />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.bonusReport.root}`,
				element: (
					<AuthRequire functionId={paths.report.sub.bonusReport.functionId}>
						<BonusReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.transferInfoManagement.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.bankTransfer.sub.transferInfoManagement.functionId
						}
					>
						<TransferInfoManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.transferInfoManagement.root}/:transferId`,
				element: (
					<AuthRequire
						functionId={
							paths.bankTransfer.sub.transferInfoManagement.functionId
						}
					>
						<TransferInfoEdit />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.withdrawalAdjustment.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.depositWithdrawalSector.sub.withdrawalAdjustment
								.functionId
						}
					>
						<WithdrawalAdjustment />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.reasonManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.bankTransfer.sub.reasonManagement.functionId}
					>
						<ReasonManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}`,
				element: (
					<AuthRequire>
						<MemberProfile />
					</AuthRequire>
				),
				children: [
					{
						path: 'dashboard/:custId',
						element: (
							<AuthRequire>
								{/* TODO: */}

								<MemberProfileDashboard />
							</AuthRequire>
						),
					},
					// * CustomerInfo 類別
					{
						path: 'customerInfo/memberFlowLog/:custId',
						element: (
							<AuthRequire>
								{/* TODO: */}
								<MemberProfileCustomerInfoMemberFlowLog />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/vipLevel/:custId',
						element: (
							<AuthRequire>
								<MemberProfileVipLevelLog />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/referralHistory/:custId',
						element: (
							<AuthRequire>
								<MemberProfileReferralHistory />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/notes/:custId',
						element: (
							<AuthRequire>
								<MemberProfileNotes />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/SMSInfo/:custId',
						element: (
							<AuthRequire>
								<MemberProfileSmsInfo />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/loginLog/:custId',
						element: (
							<AuthRequire>
								<MemberProfileLoginLog />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/deviceList/:custId',
						element: (
							<AuthRequire>
								<MemberProfileDeviceList />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/ipLog/:custId',
						element: (
							<AuthRequire>
								<MemberProfileIpList />
							</AuthRequire>
						),
					},

					// * Finance 類別
					{
						path: 'finance/depositInfo/:custId',
						element: (
							<AuthRequire>
								{/* TODO: */}
								<MemberProfileFinanceDepositInfo />
							</AuthRequire>
						),
					},
					// * Game 類別
					{
						path: 'game/statement/:custId',
						element: (
							<AuthRequire>
								{/* TODO: */}
								<MemberProfileGameStatement />
							</AuthRequire>
						),
					},
					// * marketing 類別
					{
						path: 'marketing/bonusWallet/:custId',
						element: (
							<AuthRequire>
								{/* TODO: */}
								<MemberProfileMarketingBonusWallet />
							</AuthRequire>
						),
					},
					{
						path: 'setting/:custId',
						element: (
							<AuthRequire>
								{/* TODO: */}
								<MemberProfileSetting />
							</AuthRequire>
						),
					},
					{
						path: 'adminUserLog/:custId',
						element: (
							<AuthRequire>
								{/* TODO: */}
								<MemberProfileAdminUserLog />
							</AuthRequire>
						),
					},
				],
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
