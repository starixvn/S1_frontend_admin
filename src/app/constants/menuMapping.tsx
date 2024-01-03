import {
	BankOutlined,
	BarChartOutlined,
	ControlOutlined,
	DashboardOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	SettingOutlined,
	ShopOutlined,
	ShoppingCartOutlined,
	TransactionOutlined,
	UserSwitchOutlined,
} from '@ant-design/icons'
import { NEW_SITE_PREFIX_URL, OLD_SITE_PREFIX_URL } from 'app/config'
import { CSSProperties } from 'react'
import { RiUserSettingsLine } from '@react-icons/all-files/ri/RiUserSettingsLine'
import paths from './paths'
import allowedRoles from './allowedRoles'

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
	128: <SettingOutlined style={iconStyle} />,
}

/**
 * @returns 根據 functionId 回傳 path 資訊
 */
export const getMapMenu = (functionId: number) => {
	const {
		internalPath,
		newAdminPath,
		pathMode,
		allSiteMode,
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
		allSiteMode,
		icon,
	}
}

export interface MenMappingInterface {
	icon: JSX.Element | null
	name?: string
	moduleId?: number
	functionId: number | null
	pathMode?: typeof OLD_SITE_PREFIX_URL | typeof NEW_SITE_PREFIX_URL
	allSiteMode?: boolean
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
		functionId: paths.member.sub.tagManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'CustManage/TagManagement',
		internalFunctionKey: allowedRoles.CustManageTagManagement,
		newAdminPath: paths.member.sub.tagManagement.root,
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
		allSiteMode: true,
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
		functionId:
			paths.customerSupport.sub.operatorService.sub.smsGenerator.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Message/PersonalMsgBatch',
		internalFunctionKey: allowedRoles.MessagePersonalMsgBatch,
		newAdminPath:
			paths.customerSupport.sub.operatorService.sub.smsGenerator.root,
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
		pathMode: 'NewAdmin',
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
		functionId:
			paths.finance.sub.depositWithdrawalSector.sub.depositOperator.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/DepositList',
		internalFunctionKey: allowedRoles.FinanceDepositList,
		newAdminPath:
			paths.finance.sub.depositWithdrawalSector.sub.depositOperator.root,
	},
	{
		icon: null,
		functionId:
			paths.finance.sub.depositWithdrawalSector.sub.withdrawalOperator
				.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/WithdrawalList',
		internalFunctionKey: allowedRoles.FinanceWithdrawalList,
		newAdminPath:
			paths.finance.sub.depositWithdrawalSector.sub.withdrawalOperator.root,
	},
	{
		icon: null,
		functionId:
			paths.finance.sub.depositWithdrawalSector.sub.depositSubmission
				.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/DepositSubmission',
		internalFunctionKey: allowedRoles.FinanceDepositSubmission,
		newAdminPath:
			paths.finance.sub.depositWithdrawalSector.sub.depositSubmission.root,
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
		functionId: paths.finance.sub.report.sub.depositTimeReport.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/DepositTimeReport',
		internalFunctionKey: allowedRoles.FinanceDepositTimeReport,
		newAdminPath: paths.finance.sub.report.sub.depositTimeReport.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.report.sub.withdrawalTimeReport.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/WithdrawalTimeReport',
		internalFunctionKey: allowedRoles.FinanceWithdrawalTimeReport,
		newAdminPath: paths.finance.sub.report.sub.withdrawalTimeReport.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.report.sub.paymentAdjustment.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Finance/PaymentAdjustmentReport',
		internalFunctionKey: allowedRoles.FinanceAdjustmentReport,
		newAdminPath: paths.finance.sub.report.sub.paymentAdjustment.root,
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
		pathMode: 'NewAdmin',
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
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/BonusManage',
		internalFunctionKey: allowedRoles.MarketingBonusManage,
		newAdminPath: paths.marketing.sub.bonusManagement.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.bonus.sub.pendingBonus.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/PendingBonus',
		internalFunctionKey: allowedRoles.MarketingPendingBonus,
		newAdminPath: paths.marketing.sub.bonus.sub.pendingBonus.root,
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
		functionId: paths.member.sub.vipReview.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/VipLevelReview',
		internalFunctionKey: allowedRoles.MarketingVipLevelReview,
		newAdminPath: paths.member.sub.vipReview.root,
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
		functionId: paths.marketing.sub.pointLevelManagement.functionId,
		internalFunctionKey: allowedRoles.MarketingPointLevelManagement,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/pointLevelManagement',
		newAdminPath: paths.marketing.sub.pointLevelManagement.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.announcement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Message/Announcement',
		internalFunctionKey: allowedRoles.MessageAnnouncement,
		newAdminPath: paths.cms.sub.announcement.root,
		allSiteMode: true,
	},
	{
		icon: null,
		functionId: paths.content.sub.newsManage.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/NewsManage',
		internalFunctionKey: allowedRoles.MarketingNewsManage,
		newAdminPath: paths.content.sub.newsManage.root,
		allSiteMode: true,
	},
	{
		icon: null,
		functionId: paths.cms.sub.bannerManage.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/BannerManage',
		internalFunctionKey: allowedRoles.CMSBannerManage,
		newAdminPath: paths.cms.sub.bannerManage.root,
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
		functionId: paths.cms.sub.hotGameManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/HotGamesManagement',
		internalFunctionKey: allowedRoles.CMSHotEventManagement,
		newAdminPath: paths.cms.sub.hotGameManagement.root,
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
		functionId: paths.productManagement.sub.maintenance.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/TpMaintain',
		internalFunctionKey: allowedRoles.CMSTpMaintain,
		newAdminPath: paths.productManagement.sub.maintenance.root,
	},
	{
		icon: null,
		functionId: paths.csd.sub.tpFailRecordReport.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'CustManage/TpFailRecordReport',
		internalFunctionKey: allowedRoles.CustManageTpFailRecordReport,
		newAdminPath: paths.csd.sub.tpFailRecordReport.root,
	},
	{
		icon: null,
		functionId: paths.member.sub.gameExclusion.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'CustManage/DisableUserForGame',
		internalFunctionKey: allowedRoles.CustManageDisableUserForGame,
		newAdminPath: paths.member.sub.gameExclusion.root,
	},
	{
		icon: null,
		functionId: paths.member.sub.betLimit.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'CustManage/UserBetLimit',
		internalFunctionKey: allowedRoles.CustManageUserBetLimit,
		newAdminPath: paths.member.sub.betLimit.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.urlManagement.sub.externalDomain.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/DomainManage',
		internalFunctionKey: allowedRoles.CMSDomainManage,
		newAdminPath: paths.cms.sub.urlManagement.sub.externalDomain.root,
	},
	{
		name: 'APP QR Code',
		icon: null,
		functionId: paths.cms.sub.urlManagement.sub.appQrCode.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/AppLinkManagement',
		internalFunctionKey: allowedRoles.CMSAppLinkManagement,
		newAdminPath: paths.cms.sub.urlManagement.sub.appQrCode.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.urlManagement.sub.providerAppDownload.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/DeepLinkManagement',
		internalFunctionKey: allowedRoles.CMSDeepLinkManagement,
		newAdminPath: paths.cms.sub.urlManagement.sub.providerAppDownload.root,
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
		functionId: paths.content.sub.videoManagement.functionId,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/LatestHighlightVideoManagement',
		internalFunctionKey: allowedRoles.CMSLatestHighlightVideoManagement,
		newAdminPath: paths.content.sub.videoManagement.root,
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
		functionId: paths.report.sub.bonusInfoReport.functionId,
		internalFunctionKey: allowedRoles.MarketingRebateInfoReport,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/RebateInfoReport',
		newAdminPath: paths.report.sub.bonusInfoReport.root,
		allSiteMode: true,
	},
	{
		name: 'Bonus Report',
		icon: null,
		functionId: paths.report.sub.bonusReport.functionId,
		internalFunctionKey: allowedRoles.MarketingBonusInfoReport,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/BonusInfoReport',
		newAdminPath: paths.report.sub.bonusReport.root,
		allSiteMode: true,
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
		functionId: paths.report.sub.vipRebateReport.functionId,
		internalFunctionKey: allowedRoles.MarketingVipRebateInfoReport,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/VipRebateInfoReport',
		newAdminPath: paths.report.sub.vipRebateReport.root,
		allSiteMode: true,
	},
	{
		icon: null,
		functionId: paths.report.sub.verificationReport.functionId,
		internalFunctionKey: allowedRoles.MarketingVerificationRewardReport,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/VerificationRewardReport',
		newAdminPath: paths.report.sub.verificationReport.root,
		allSiteMode: true,
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
		functionId: paths.report.sub.drawPrizeReport.functionId,
		internalFunctionKey: allowedRoles.MarketingDrawPrizeReport,
		pathMode: 'NewAdmin',
		internalPath: 'Marketing/DrawPrizeReport',
		newAdminPath: paths.report.sub.drawPrizeReport.root,
	},
	{
		name: 'Win Lost Report',
		icon: null,
		functionId: paths.report.sub.winLostReport.functionId,
		internalFunctionKey: allowedRoles.MarketingDrawPrizeReport,
		pathMode: 'NewAdmin',
		internalPath: 'Report/LicWinLost',
		newAdminPath: paths.report.sub.winLostReport.root,
		allSiteMode: true,
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
		functionId: paths.report.sub.depositPaymentReport.functionId,
		internalFunctionKey: allowedRoles.ReportDepositReport,
		pathMode: 'NewAdmin',
		internalPath: 'Report/DepositReport',
		newAdminPath: paths.report.sub.depositPaymentReport.root,
		allSiteMode: true,
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
		functionId: paths.report.sub.userOnlineReport.functionId,
		internalFunctionKey: allowedRoles.ReportUserOnlineReport,
		pathMode: 'NewAdmin',
		internalPath: 'Report/UserOnlineReport',
		newAdminPath: paths.report.sub.userOnlineReport.root,
	},
	{
		icon: null,
		functionId: paths.bankTransfer.sub.transferInfoManagement.functionId,
		internalFunctionKey: allowedRoles.BankFinancialTransferManage,
		pathMode: 'NewAdmin',
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
		pathMode: 'NewAdmin',
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
		functionId: paths.bankTransfer.sub.bankFinancialReport.functionId,
		internalFunctionKey: allowedRoles.BankFinancialReportBankFinancialReport,
		pathMode: 'NewAdmin',
		internalPath: 'BankFinancial/BankFinancialReport',
		newAdminPath: paths.bankTransfer.sub.bankFinancialReport.root,
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
		allSiteMode: true,
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
	{
		icon: null,
		functionId: paths.systemSetting.sub.exchangeUsdRate.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.systemSetting.sub.exchangeUsdRate.root,
	},
	{
		icon: null,
		functionId: paths.systemSetting.sub.bettingMonitorSetting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.systemSetting.sub.bettingMonitorSetting.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.gameStatisticalReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.gameStatisticalReport.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.withdrawalPaymentReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.withdrawalPaymentReport.root,
		allSiteMode: true,
	},
	{
		icon: null,
		functionId: paths.member.sub.shieldTaggingReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.member.sub.shieldTaggingReport.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.setting.sub.modifyPaymentFeeLog.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.finance.sub.setting.sub.modifyPaymentFeeLog.root,
	},
	{
		icon: null,
		functionId: paths.member.sub.iovation.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.member.sub.iovation.root,
	},
	{
		icon: null,
		functionId: paths.finance.sub.setting.sub.modifyPaymentFeeLog.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.finance.sub.setting.sub.modifyPaymentFeeLog.root,
	},
	{
		icon: null,
		functionId: paths.customerSupport.sub.batchMemberInfoReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.customerSupport.sub.batchMemberInfoReport.root,
	},
	{
		icon: null,
		functionId: paths.risk.sub.blockCryptoWallet.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.risk.sub.blockCryptoWallet.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.leaderboardReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.leaderboardReport.root,
		allSiteMode: true,
	},
	{
		icon: null,
		functionId: paths.cms.sub.leaderboardExtraPoint.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.cms.sub.leaderboardExtraPoint.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.rebateExcludeGame.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.marketing.sub.rebateExcludeGame.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.vipUpgradeSetting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.marketing.sub.vipUpgradeSetting.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.vipUpgradeSetting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.marketing.sub.vipUpgradeSetting.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.mpaMarketingReport.functionId,
		pathMode: 'NewAdmin',
		allSiteMode: true,
		newAdminPath: paths.report.sub.mpaMarketingReport.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.newReferralManagement.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.marketing.sub.newReferralManagement.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.newReferralReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.newReferralReport.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.newReferralCustReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.newReferralCustReport.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.editNewReferralManagement.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.marketing.sub.editNewReferralManagement.root,
	},
	{
		icon: null,
		functionId: paths.marketing.sub.rebateExcludeGame.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.marketing.sub.rebateExcludeGame.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.confiscatedSummaryReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.confiscatedSummaryReport.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.leaderboardManagement.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.cms.sub.leaderboardManagement.root,
	},
	{
		icon: null,
		functionId: paths.cms.sub.bigWinPopUpSetting.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.cms.sub.bigWinPopUpSetting.root,
	},
	{
		icon: null,
		functionId: paths.report.sub.bigWinPopUpReport.functionId,
		pathMode: 'NewAdmin',
		newAdminPath: paths.report.sub.bigWinPopUpReport.root,
	},
]
