import {
	BankOutlined,
	BarChartOutlined,
	ControlOutlined,
	DashboardOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	ShopOutlined,
	TransactionOutlined,
	UserSwitchOutlined,
} from '@ant-design/icons'
import { Button, Result } from 'antd'
import { NEW_SITE_PREFIX_URL, OLD_SITE_PREFIX_URL } from 'app/config'
import { CSSProperties } from 'react'
import { RiUserSettingsLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import allowedRoles from './allowedRoles'
import paths from './paths'

const iconStyle: CSSProperties = {
	fontSize: '20px',
}
interface moduleIconInterface {
	[moduleId: number]: JSX.Element
}

export const MODULE_ICON_MAPPING: moduleIconInterface = {
	2: <UserSwitchOutlined style={iconStyle} />,
	3: <BankOutlined style={iconStyle} />,
	4: <ShopOutlined style={iconStyle} />,
	5: <EditOutlined style={iconStyle} />,
	6: <ExclamationCircleOutlined style={iconStyle} />,
	7: <BarChartOutlined style={iconStyle} />,
	8: <TransactionOutlined style={iconStyle} />,
	9: <RiUserSettingsLine style={iconStyle} />,
	19: <ControlOutlined style={iconStyle} />,
}

export const getMapMenu = (functionId: number) => {
	const {
		internalPath,
		newAdminPath,
		pathMode,
		icon,
		index,
		internalFunctionKey,
	} = (MENU_MAPPING.find(item => item.functionId === functionId) ??
		{}) as MenMappingInterface

	const path = pathMode
		? {
				Internal: internalPath,
				NewAdmin: newAdminPath,
		  }[pathMode]
		: ''

	return {
		...(pathMode === 'Internal' && { internalFunctionKey }),
		path: index || !path ? '/' : `/${pathMode}/${path}`,
		pathMode,
		icon,
	}
}

export interface MenMappingInterface {
	icon: JSX.Element | null
	name?: string
	moduleId?: number
	functionId: number | null
	pathMode?: typeof OLD_SITE_PREFIX_URL | typeof NEW_SITE_PREFIX_URL
	internalPath?: string
	internalFunctionKey?: string
	newAdminPath?: string
	index?: boolean
	element?: JSX.Element
}

export const MENU_MAPPING: MenMappingInterface[] = [
	{
		icon: <DashboardOutlined style={iconStyle} />,
		functionId: paths.dashboard.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Home/DashboardNew',
		internalFunctionKey: allowedRoles.HomeDashboardNew,
		newAdminPath: paths.dashboard.root,
	},
	{
		icon: null,
		functionId: 22,
		pathMode: 'Internal',
		internalPath: 'CustManage/CustInfoList',
		internalFunctionKey: allowedRoles.CustManageCustInfoList,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 26,
		pathMode: 'Internal',
		internalPath: 'CustManage/TagManagement',
		internalFunctionKey: allowedRoles.CustManageTagManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 23,
		name: 'Live Registration Statistics',
		pathMode: 'Internal',
		internalPath: 'CustManage/RegistrationManagement',
		internalFunctionKey: allowedRoles.CustManageRegistrationManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 24,
		pathMode: 'Internal',
		internalPath: 'CustManage/TeleCSD',
		internalFunctionKey: allowedRoles.CustManageTeleCSD,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 25,
		pathMode: 'Internal',
		internalPath: 'Message/PersonalMsgBatch',
		internalFunctionKey: allowedRoles.MessagePersonalMsgBatch,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 33,
		pathMode: 'Internal',
		internalPath: 'Finance/BonusPayout',
		internalFunctionKey: allowedRoles.FinanceBonusPayout,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 37,
		pathMode: 'Internal',
		internalPath: 'Message/WithdrawalKYCControl',
		internalFunctionKey: allowedRoles.MessageWithdrawalKYCControl,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 27,
		pathMode: 'Internal',
		internalPath: 'Finance/DepositList',
		internalFunctionKey: allowedRoles.FinanceDepositList,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 28,
		pathMode: 'Internal',
		internalPath: 'Finance/WithdrawalList',
		internalFunctionKey: allowedRoles.FinanceWithdrawalList,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 29,
		pathMode: 'Internal',
		internalPath: 'Finance/DepositSubmission',
		internalFunctionKey: allowedRoles.FinanceDepositSubmission,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 30,
		pathMode: 'Internal',
		internalPath: 'Finance/WithdrawalLimitAdjust',
		internalFunctionKey: allowedRoles.FinanceWithdrawalLimitAdjust,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 31,
		pathMode: 'Internal',
		internalPath: 'Finance/PaymentAdjustment',
		internalFunctionKey: allowedRoles.FinancePaymentAdjustment,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 32,
		pathMode: 'Internal',
		internalPath: 'Finance/ThirdPartyAdjustment',
		internalFunctionKey: allowedRoles.FinanceThirdPartyAdjustment,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 34,
		pathMode: 'Internal',
		internalPath: 'Finance/DepositTimeReport',
		internalFunctionKey: allowedRoles.FinanceDepositTimeReport,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 35,
		pathMode: 'Internal',
		internalPath: 'Finance/WithdrawalTimeReport',
		internalFunctionKey: allowedRoles.FinanceWithdrawalTimeReport,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 36,
		pathMode: 'Internal',
		internalPath: 'Finance/PaymentAdjustmentReport',
		internalFunctionKey: allowedRoles.FinanceAdjustmentReport,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 94,
		pathMode: 'Internal',
		internalPath: 'Finance/WithdrawalAccountingList',
		internalFunctionKey: allowedRoles.FinanceWithdrawalAccountingList,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 38,
		pathMode: 'Internal',
		internalPath: 'Finance/BankInfoList',
		internalFunctionKey: allowedRoles.FinanceBankInfoList,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 39,
		pathMode: 'Internal',
		internalPath: 'Finance/PaymentManage',
		internalFunctionKey: allowedRoles.FinancePaymentManage,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 40,
		pathMode: 'Internal',
		internalPath: 'Finance/DepositLimitManagement',
		internalFunctionKey: allowedRoles.FinanceDepositLimitManage,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 41,
		pathMode: 'Internal',
		internalPath: 'Finance/WithdrawalLimitManagement',
		internalFunctionKey: allowedRoles.FinanceWithdrawalLimitManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 42,
		pathMode: 'Internal',
		internalPath: 'Finance/CryptoWithdrawalLimitManagement',
		internalFunctionKey: allowedRoles.FinanceUSDTWithdrawalLimitManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 43,
		pathMode: 'Internal',
		internalPath: 'Finance/AdjustmentLimitManagement',
		internalFunctionKey: allowedRoles.FinanceAdjustmentLimitManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 44,
		pathMode: 'Internal',
		internalPath: 'Marketing/RegistrationForMarketing',
		internalFunctionKey: allowedRoles.MarketingRegistrationForMarketing,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 45,
		pathMode: 'Internal',
		internalPath: 'Marketing/BonusManage',
		internalFunctionKey: allowedRoles.MarketingBonusManage,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 46,
		pathMode: 'Internal',
		internalPath: 'Marketing/PendingBonus',
		internalFunctionKey: allowedRoles.MarketingPendingBonus,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 47,
		pathMode: 'Internal',
		internalPath: 'Marketing/VerificationReward',
		internalFunctionKey: allowedRoles.MarketingVerificationReward,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 48,
		pathMode: 'Internal',
		internalPath: 'Marketing/ReferralManagement',
		internalFunctionKey: allowedRoles.MarketingReferralManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 49,
		pathMode: 'Internal',
		internalPath: 'Marketing/VipRebateMangetment',
		internalFunctionKey: allowedRoles.MarketingVipRebateMangetment,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 50,
		pathMode: 'Internal',
		internalPath: 'Marketing/VipLevelReview',
		internalFunctionKey: allowedRoles.MarketingVipLevelReview,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 51,
		pathMode: 'Internal',
		internalPath: 'Message/ChangeVipLevelBatch',
		internalFunctionKey: allowedRoles.MessageChangeVipLevelBatch,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 52,
		internalFunctionKey: allowedRoles.MarketingPointLevelManagement,
		pathMode: 'Internal',
		internalPath: 'Marketing/PointLevelManagement',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 53,
		pathMode: 'Internal',
		internalPath: 'Message/Announcement',
		internalFunctionKey: allowedRoles.MessageAnnouncement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 54,
		pathMode: 'Internal',
		internalPath: 'Marketing/NewsManage',
		internalFunctionKey: allowedRoles.MarketingNewsManage,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 55,
		pathMode: 'Internal',
		internalPath: 'Marketing/BannerManage',
		internalFunctionKey: allowedRoles.CMSBannerManage,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 56,
		pathMode: 'Internal',
		internalPath: 'Marketing/HotEventManagement',
		internalFunctionKey: allowedRoles.CMSHotEventManagement,
		newAdminPath: '',
	},

	{
		icon: null,
		functionId: 69,
		pathMode: 'Internal',
		internalPath: 'Marketing/LeaderBoardExtraPoint',
		internalFunctionKey: allowedRoles.CMSLeaderBoardExtraPoint,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 57,
		pathMode: 'Internal',
		internalPath: 'Marketing/GameCasinoManagement',
		internalFunctionKey: allowedRoles.CMSGameCasinoManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 58,
		pathMode: 'Internal',
		internalPath: 'Marketing/SlotGamesManagement',
		internalFunctionKey: allowedRoles.CMSSlotGamesManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 59,
		pathMode: 'Internal',
		internalPath: 'Marketing/CategoryManagement',
		internalFunctionKey: allowedRoles.CMSCategoryManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 60,
		pathMode: 'Internal',
		internalPath: 'Marketing/TpMaintain',
		internalFunctionKey: allowedRoles.CMSTpMaintain,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 61,
		pathMode: 'Internal',
		internalPath: 'CustManage/TpFailRecordReport',
		internalFunctionKey: allowedRoles.CustManageTpFailRecordReport,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 62,
		pathMode: 'Internal',
		internalPath: 'CustManage/DisableUserForGame',
		internalFunctionKey: allowedRoles.CustManageDisableUserForGame,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 63,
		pathMode: 'Internal',
		internalPath: 'CustManage/UserBetLimit',
		internalFunctionKey: allowedRoles.CustManageUserBetLimit,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 64,
		pathMode: 'Internal',
		internalPath: 'Marketing/DomainManage',
		internalFunctionKey: allowedRoles.CMSDomainManage,
		newAdminPath: '',
	},
	{
		name: 'APP QR Code',
		icon: null,
		functionId: 65,
		pathMode: 'Internal',
		internalPath: 'Marketing/AppLinkManagement',
		internalFunctionKey: allowedRoles.CMSAppLinkManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 66,
		pathMode: 'Internal',
		internalPath: 'Marketing/DeepLinkManagement',
		internalFunctionKey: allowedRoles.CMSDeepLinkManagement,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 67,
		pathMode: 'Internal',
		internalPath: 'Finance/LineChannel',
		internalFunctionKey: allowedRoles.FinanceLineChannel,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 68,
		pathMode: 'Internal',
		internalPath: 'Marketing/LatestHighlightVideoManagement',
		internalFunctionKey: allowedRoles.CMSLatestHighlightVideoManagement,
		newAdminPath: '',
	},

	{
		icon: null,
		functionId: 70,
		pathMode: 'NewAdmin',
		newAdminPath: 'Risk/BlockBankAccount',
		element: (
			<Result
				status='warning'
				title='Page Not Found: Risk/BlockBankAccount'
				extra={
					<Link to='/Internal/Home/DashboardNew'>
						<Button type='primary' key='console'>
							Back Dashboard
						</Button>
					</Link>
				}
			/>
		),
	},
	{
		icon: null,
		functionId: 71,
		pathMode: 'NewAdmin',
		newAdminPath: 'Risk/BlockIP',
		element: (
			<Result
				status='warning'
				title='Page Not Found: Risk/BlockIP'
				extra={
					<Link to='/Internal/Home/DashboardNew'>
						<Button type='primary' key='console'>
							Back Dashboard
						</Button>
					</Link>
				}
			/>
		),
	},
	{
		icon: null,
		functionId: 72,
		internalFunctionKey: allowedRoles.MarketingRebateInfoReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/RebateInfoReport',
		newAdminPath: '',
	},
	{
		name: 'Bonus Report',
		icon: null,
		functionId: 73,
		internalFunctionKey: allowedRoles.MarketingBonusInfoReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/BonusInfoReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 74,
		internalFunctionKey: allowedRoles.MarketingRebateLogReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/RebateLogReport',
		newAdminPath: '',
	},
	{
		name: 'VIP Rebate Report',
		icon: null,
		functionId: 75,
		internalFunctionKey: allowedRoles.MarketingVipRebateInfoReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/VipRebateInfoReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 76,
		internalFunctionKey: allowedRoles.MarketingVerificationRewardReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/VerificationRewardReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 77,
		internalFunctionKey: allowedRoles.MarketingReferralReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/ReferralReport',
		newAdminPath: '',
	},
	{
		name: 'Draw Prize Report',
		icon: null,
		functionId: 78,
		internalFunctionKey: allowedRoles.MarketingDrawPrizeReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/DrawPrizeReport',
		newAdminPath: '',
	},
	{
		name: 'Win Lost Report',
		icon: null,
		functionId: 79,
		internalFunctionKey: allowedRoles.MarketingDrawPrizeReport,
		pathMode: 'Internal',
		internalPath: 'Report/LicWinLost',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 80,
		internalFunctionKey: allowedRoles.ReportMainFinancialReport,
		pathMode: 'Internal',
		internalPath: 'Report/MainFinancialReport',
		newAdminPath: '',
	},
	{
		name: 'Deposit Report',
		icon: null,
		functionId: 81,
		internalFunctionKey: allowedRoles.ReportDepositReport,
		pathMode: 'Internal',
		internalPath: 'Report/DepositReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 82,
		internalFunctionKey: allowedRoles.ReportStatisticalReport,
		pathMode: 'Internal',
		internalPath: 'Report/StatisticalReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 83,
		internalFunctionKey: allowedRoles.ReportCustomerStatisticalReport,
		pathMode: 'Internal',
		internalPath: 'Report/CustomerStatisticalReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 84,
		internalFunctionKey: allowedRoles.ReportUserOnlineReport,
		pathMode: 'Internal',
		internalPath: 'Report/UserOnlineReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 85,
		internalFunctionKey: allowedRoles.BankFinancialTransferManage,
		pathMode: 'Internal',
		internalPath: 'BankFinancial/TransferManage',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 86,
		internalFunctionKey: allowedRoles.BankFinancialTransferAccountManage,
		pathMode: 'Internal',
		internalPath: 'BankFinancial/TransferAccountManage',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 87,
		internalFunctionKey: allowedRoles.BankFinancialReasonManagement,
		pathMode: 'Internal',
		internalPath: 'BankFinancial/ReasonManagement',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 88,
		internalFunctionKey: allowedRoles.BankFinancialReportTransferInfoReport,
		pathMode: 'Internal',
		internalPath: 'BankFinancial/TransferInfoReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 89,
		internalFunctionKey: allowedRoles.BankFinancialReportBankFinancialReport,
		pathMode: 'Internal',
		internalPath: 'BankFinancial/BankFinancialReport',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: paths.administration.sub.roleManagement.functionId,
		internalFunctionKey: allowedRoles.AdminGroupAuthoritySetting,
		pathMode: 'NewAdmin',
		internalPath: 'Admin/GroupAuthoritySetting',
		newAdminPath: `${paths.administration.sub.roleManagement.root}`,
	},
	{
		icon: null,
		functionId: 91,
		internalFunctionKey: allowedRoles.AdminUserAuthoritySetting,
		pathMode: 'Internal',
		internalPath: 'Admin/UserAuthoritySetting',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 92,
		internalFunctionKey: allowedRoles.AdminSpecialPasswordManagement,
		pathMode: 'Internal',
		internalPath: 'Admin/SpecialPasswordManagement',
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: 93,
		internalFunctionKey: allowedRoles.FinanceAdjustmentLogReport,
		pathMode: 'Internal',
		internalPath: 'Finance/AdjustmentLogReport',
		newAdminPath: '',
	},
]
