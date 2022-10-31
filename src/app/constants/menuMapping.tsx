import {
	BankOutlined,
	BarChartOutlined,
	ControlOutlined,
	DashboardOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	ShopOutlined,
	ShoppingCartOutlined,
	TransactionOutlined,
	UserSwitchOutlined,
} from '@ant-design/icons'
import { NEW_SITE_PREFIX_URL, OLD_SITE_PREFIX_URL } from 'app/config'
import { CSSProperties } from 'react'
import { RiUserSettingsLine } from '@react-icons/all-files/ri/RiUserSettingsLine'

import allowedRoles from './allowedRoles'
import paths from './paths'

const iconStyle: CSSProperties = {
	fontSize: '20px',
}
interface ModuleIconInterface {
	[moduleId: number]: JSX.Element
}

export const MODULE_ICON_MAPPING: ModuleIconInterface = {
	2: <UserSwitchOutlined style={iconStyle} />,
	3: <BankOutlined style={iconStyle} />,
	4: <ShopOutlined style={iconStyle} />,
	5: <EditOutlined style={iconStyle} />,
	6: <ExclamationCircleOutlined style={iconStyle} />,
	7: <BarChartOutlined style={iconStyle} />,
	8: <TransactionOutlined style={iconStyle} />,
	9: <RiUserSettingsLine style={iconStyle} />,
	19: <ControlOutlined style={iconStyle} />,
	102: <ShoppingCartOutlined style={iconStyle} />,
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
		functionId: 130,
		pathMode: 'Internal',
		internalPath: 'CustManage/CustInfoList',
		internalFunctionKey: allowedRoles.CustManageCustInfoList,
	},
	{
		icon: null,
		functionId: paths.customerSupport.sub.memberAdministrationList.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.customerSupport.sub.memberAdministrationList.root,
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
		functionId:
			paths.customerSupport.sub.operatorService.sub.liveRegistrationStatistics
				.functionId,
		name: 'Live Registration Statistics',
		pathMode: 'NewAdmin',
		internalPath: 'CustManage/RegistrationManagement',
		internalFunctionKey: allowedRoles.CustManageRegistrationManagement,
		newAdminPath:
			paths.customerSupport.sub.operatorService.sub.liveRegistrationStatistics
				.root,
	},
	{
		icon: null,
		functionId:
			paths.customerSupport.sub.operatorService.sub.otpVerificationReport
				.functionId,
		name: 'Live Registration Statistics',
		pathMode: 'NewAdmin',
		newAdminPath:
			paths.customerSupport.sub.operatorService.sub.otpVerificationReport.root,
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
		functionId: 32,
		pathMode: 'Internal',
		internalPath: 'Finance/ThirdPartyAdjustment',
		internalFunctionKey: allowedRoles.FinanceThirdPartyAdjustment,
		newAdminPath: '',
	},
	{
		icon: null,
		functionId: paths.finance.sub.issueBonusManagement.functionId,
		pathMode: 'Internal',
		internalPath: 'Finance/BonusPayout',
		internalFunctionKey: allowedRoles.FinanceBonusPayout,
		newAdminPath: paths.finance.sub.issueBonusManagement.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.withdrawalKycControl.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Message/WithdrawalKYCControl',
		internalFunctionKey: allowedRoles.MessageWithdrawalKYCControl,
		newAdminPath: paths.finance.sub.withdrawalKycControl.root,
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
		functionId:
			paths.finance.sub.depositWithdrawalSector.sub.withdrawalAdjustment
				.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/WithdrawalLimitAdjust',
		internalFunctionKey: allowedRoles.FinanceWithdrawalLimitAdjust,
		newAdminPath:
			paths.finance.sub.depositWithdrawalSector.sub.withdrawalAdjustment.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.adjustment.sub.balanceAdjustment.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/PaymentAdjustment',
		internalFunctionKey: allowedRoles.FinancePaymentAdjustment,
		newAdminPath: paths.finance.sub.adjustment.sub.balanceAdjustment.root,
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
		functionId: paths.finance.sub.accounting.sub.depositAccounting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.finance.sub.accounting.sub.depositAccounting.root,
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
		functionId: paths.finance.sub.setting.sub.bankAccManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/BankInfoList',
		internalFunctionKey: allowedRoles.FinanceBankInfoList,
		newAdminPath: paths.finance.sub.setting.sub.bankAccManagement.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.paymentGateway.functionId,
		pathMode: 'Internal',
		internalPath: 'Finance/PaymentManage',
		internalFunctionKey: allowedRoles.FinancePaymentManage,
		newAdminPath: paths.finance.sub.paymentGateway.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.setting.sub.depositLimitation.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/DepositLimitManagement',
		internalFunctionKey: allowedRoles.FinanceDepositLimitManage,
		newAdminPath: paths.finance.sub.setting.sub.depositLimitation.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.setting.sub.withdrawalLimitation.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/WithdrawalLimitManagement',
		internalFunctionKey: allowedRoles.FinanceWithdrawalLimitManagement,
		newAdminPath: paths.finance.sub.setting.sub.withdrawalLimitation.root,
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
		functionId: paths.finance.sub.setting.sub.adjustmentLimitation.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/AdjustmentLimitManagement',
		internalFunctionKey: allowedRoles.FinanceAdjustmentLimitManagement,
		newAdminPath: paths.finance.sub.setting.sub.adjustmentLimitation.root,
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
		functionId: paths.marketing.sub.bonusManagement.functionId,
		pathMode: 'Internal',
		internalPath: 'Marketing/BonusManage',
		internalFunctionKey: allowedRoles.MarketingBonusManage,
		newAdminPath: paths.marketing.sub.bonusManagement.root,
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
		functionId: paths.marketing.sub.verificationRewardManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/VerificationReward',
		internalFunctionKey: allowedRoles.MarketingVerificationReward,
		newAdminPath: paths.marketing.sub.verificationRewardManagement.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.referralManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/ReferralManagement',
		internalFunctionKey: allowedRoles.MarketingReferralManagement,
		newAdminPath: paths.marketing.sub.referralManagement.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.vipRebateManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/VipRebateMangetment',
		internalFunctionKey: allowedRoles.MarketingVipRebateMangetment,
		newAdminPath: paths.marketing.sub.vipRebateManagement.root,
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
		functionId: paths.cms.sub.hotEventManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/HotEventManagement',
		internalFunctionKey: allowedRoles.CMSHotEventManagement,
		newAdminPath: paths.cms.sub.hotEventManagement.root,
	},
	{
		icon: null,
		functionId: 95,
		pathMode: 'Internal',
		internalPath: 'Marketing/HotGamesManagement',
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
		functionId: paths.productManagement.sub.slotGameCategory.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/CategoryManagement',
		internalFunctionKey: allowedRoles.CMSCategoryManagement,
		newAdminPath: paths.productManagement.sub.slotGameCategory.root,
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
		functionId: paths.cms.sub.urlManagement.sub.lineDepositChannel.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/LineChannel',
		internalFunctionKey: allowedRoles.FinanceLineChannel,
		newAdminPath: paths.cms.sub.urlManagement.sub.lineDepositChannel.root,
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
		newAdminPath: paths.risk.sub.blockBankAccount.root,
	},
	{
		icon: null,
		functionId: 71,
		pathMode: 'NewAdmin',
		newAdminPath: paths.risk.sub.blockIp.root,
	},
	{
		icon: null,
		functionId: paths.member.sub.blockEWallet.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.member.sub.blockEWallet.root,
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
		functionId: paths.report.sub.bonusReport.functionId,
		internalFunctionKey: allowedRoles.MarketingBonusInfoReport,
		pathMode: 'Internal',
		internalPath: 'Marketing/BonusInfoReport',
		newAdminPath: paths.report.sub.bonusReport.root,
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
		functionId: paths.marketing.sub.referralReport.functionId,
		internalFunctionKey: allowedRoles.MarketingReferralReport,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/ReferralReport',
		newAdminPath: paths.marketing.sub.referralReport.root,
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
		functionId: paths.bankTransfer.sub.transferInfoManagement.functionId,
		internalFunctionKey: allowedRoles.BankFinancialTransferManage,
		pathMode: 'Internal',
		internalPath: 'BankFinancial/TransferManage',
		newAdminPath: paths.bankTransfer.sub.transferInfoManagement.root,
	},
	{
		icon: null,
		functionId: paths.bankTransfer.sub.transferAccountManagement.functionId,
		internalFunctionKey: allowedRoles.BankFinancialTransferAccountManage,
		pathMode: 'NewAdmin',
		internalPath: 'BankFinancial/TransferAccountManage',
		newAdminPath: paths.bankTransfer.sub.transferAccountManagement.root,
	},
	{
		icon: null,
		functionId: paths.bankTransfer.sub.reasonManagement.functionId,
		internalFunctionKey: allowedRoles.BankFinancialReasonManagement,
		pathMode: 'Internal',
		internalPath: 'BankFinancial/ReasonManagement',
		newAdminPath: paths.bankTransfer.sub.reasonManagement.root,
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
		pathMode: 'NewAdmin',
		newAdminPath: `${paths.administration.sub.roleManagement.root}`,
	},
	{
		icon: null,
		functionId: paths.administration.sub.userSetting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: `${paths.administration.sub.userSetting.root}`,
	},
	{
		icon: null,
		functionId: paths.administration.sub.specialPasswordManagement.functionId,
		internalFunctionKey: allowedRoles.AdminSpecialPasswordManagement,
		pathMode: 'NewAdmin',
		internalPath: 'Admin/SpecialPasswordManagement',
		newAdminPath: paths.administration.sub.specialPasswordManagement.root,
	},
	{
		icon: null,
		functionId: 93,
		pathMode: 'NewAdmin',
		newAdminPath: paths.administration.sub.adjustmentLogReport.root,
	},
	{
		icon: null,
		functionId: 96,
		internalFunctionKey: allowedRoles.AdminGroupAuthoritySetting,
		pathMode: 'Internal',
		internalPath: allowedRoles.AdminGroupAuthoritySetting,
	},
	{
		icon: null,
		functionId: 97,
		internalFunctionKey: allowedRoles.AdminUserAuthoritySetting,
		pathMode: 'Internal',
		internalPath: allowedRoles.AdminUserAuthoritySetting,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.pointSetting.sub.inactivePointExpiry.functionId,
		pathMode: 'NewAdmin',
		newAdminPath:
			paths.rewardProgram.sub.pointSetting.sub.inactivePointExpiry.root,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.giftManagement.sub.redemptionLimit.functionId,
		pathMode: 'NewAdmin',
		newAdminPath:
			paths.rewardProgram.sub.giftManagement.sub.redemptionLimit.root,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.pointSetting.sub.turnoverPoint.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.pointSetting.sub.turnoverPoint.root,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.giftManagement.sub.giftListing.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.giftManagement.sub.giftListing.root,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.pointSetting.sub.depositPoint.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.pointSetting.sub.depositPoint.root,
	},
	{
		icon: null,
		functionId: paths.rewardProgram.sub.memberList.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.memberList.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.betList.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.betList.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.worldCupTeamReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.worldCupTeamReport.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.worldCupMemberReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.worldCupMemberReport.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.worldCupSetting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.cms.sub.worldCupSetting.root,
	},
	{
		icon: null,
		functionId: paths.rewardProgram.sub.redemptionListing.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.redemptionListing.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.siteMaintenance.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.cms.sub.siteMaintenance.root,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.report.sub.adjustmentPointReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.report.sub.adjustmentPointReport.root,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.report.sub.depositPointReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.report.sub.depositPointReport.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.setting.sub.eWalletSetting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.finance.sub.setting.sub.eWalletSetting.root,
	},
	{
		icon: null,
		functionId:
			paths.rewardProgram.sub.report.sub.turnoverPointReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.rewardProgram.sub.report.sub.turnoverPointReport.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.urlManagement.sub.snsManagement.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.cms.sub.urlManagement.sub.snsManagement.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.rewardBonusExport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.rewardBonusExport.root,
	},
	{
		icon: null,
		functionId:
			paths.finance.sub.depositWithdrawalSector.sub.withdrawalSubmission
				.functionId,
		pathMode: 'NewAdmin',
		newAdminPath:
			paths.finance.sub.depositWithdrawalSector.sub.withdrawalSubmission.root,
	},
]
