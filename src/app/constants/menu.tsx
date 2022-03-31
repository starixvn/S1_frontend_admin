import { CSSProperties, lazy } from "react";
import {
	BankOutlined,
	BarChartOutlined,
	DashboardOutlined,
	EditOutlined,
	ShopOutlined,
	UserSwitchOutlined
} from "@ant-design/icons";
import { FaGamepad } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { NEW_SITE_PREFIX_URL, OLD_SITE_PREFIX_URL } from "app/config";
import path from "app/constants/paths";
import allowedRoles from "app/constants/allowedRoles";

const iconStyle: CSSProperties = {
	fontSize: "22px"
};

export interface SubMenuType {
	icon?: JSX.Element | null;
	displayKey: string;
	menuKey?: string;
	childs: (SubMenuType | MenuItemType)[] | null;
}

export interface MenuItemType {
	icon?: JSX.Element | null;
	displayKey: string;
	allowedRole: string;
	oldPath: string;
	newPath: string;
	pathMode: typeof OLD_SITE_PREFIX_URL | typeof NEW_SITE_PREFIX_URL;
	isIndex?: boolean;
	element: JSX.Element;
	childs: (SubMenuType | MenuItemType)[] | null;
}

export type MenuListType = (SubMenuType | MenuItemType)[];

const Dashboard = lazy(() => import("features/dashboard"));

export const MENU_LIST: MenuListType = [
	{
		icon: <DashboardOutlined style={iconStyle} />,
		displayKey: "Menu.Label_Dashboard",
		allowedRole: allowedRoles.HomeDashboardNew,
		oldPath: "Home/DashboardNew",
		newPath: path.dashboard.root,
		pathMode: "Internal",
		isIndex: true,
		element: <Dashboard />,
		childs: null
	},
	{
		icon: <UserSwitchOutlined style={iconStyle} />,
		displayKey: "Menu.CSD.Label_CSD",
		menuKey: "CSD",
		childs: [
			{
				displayKey: "Menu.CSD.Label_MemberListing",
				allowedRole: allowedRoles.CustManageCustInfoList,
				oldPath: "CustManage/CustInfoList",
				newPath: path.csd.sub.memberListing.root,
				pathMode: "Internal",
				element: <div>memberListing</div>,
				childs: null
			},
			{
				displayKey: "Menu.CSD.Label_RegistrationReport",
				allowedRole: allowedRoles.CustManageRegistrationManagement,
				oldPath: "CustManage/RegistrationManagement",
				newPath: path.csd.sub.registrationReport.root,
				pathMode: "Internal",
				element: <div>RegistrationReport</div>,
				childs: null
			},
			{
				displayKey: "Menu.CSD.Label_TagManagement",
				allowedRole: allowedRoles.CustManageTagManagement,
				oldPath: "CustManage/TagManagement",
				newPath: path.csd.sub.tagManagement.root,
				pathMode: "Internal",
				element: <div>tagManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.CSD.Label_ChangeVipLevel",
				allowedRole: allowedRoles.MessageChangeVipLevelBatch,
				oldPath: "Message/ChangeVipLevelBatch",
				newPath: path.csd.sub.changeVipLevel.root,
				pathMode: "Internal",
				element: <div>changeVipLevelBatch</div>,
				childs: null
			},
			{
				icon: null,
				displayKey: "Menu.CSD.Label_Communication",
				menuKey: "CSD.Communication",
				childs: [
					{
						displayKey: "Menu.CSD.Label_TeleMarketing",
						allowedRole: allowedRoles.CustManageTeleCSD,
						oldPath: "CustManage/TeleCSD",
						newPath: path.csd.sub.teleMarketing.root,
						pathMode: "Internal",
						element: <div>teleMarketing</div>,
						childs: null
					},
					{
						displayKey: "Menu.CSD.Label_PersonalMessage",
						allowedRole: allowedRoles.MessagePersonalMsgBatch,
						oldPath: "Message/PersonalMsgBatch",
						newPath: path.csd.sub.personalMsgBatch.root,
						pathMode: "Internal",
						element: <div>personalMsgBatch</div>,
						childs: null
					}
				]
			},
			{
				icon: null,
				displayKey: "Menu.CSD.Label_KYC",
				menuKey: "CSD.KYC",
				childs: [
					{
						displayKey: "Menu.CSD.Label_WithdrawalSetting",
						allowedRole: allowedRoles.MessageWithdrawalKYCControl,
						oldPath: "Message/WithdrawalKYCControl",
						newPath: path.csd.sub.withdrawalSetting.root,
						pathMode: "Internal",
						element: <div>withdrawalKYCControl</div>,
						childs: null
					}
				]
			},
			{
				icon: null,
				displayKey: "Menu.CSD.Label_MemberGameSetting",
				menuKey: "CSD.MemberGameSetting",
				childs: [
					{
						displayKey: "Menu.CSD.Label_MemberGameExclusion",
						allowedRole: allowedRoles.CustManageDisableUserForGame,
						oldPath: "CustManage/DisableUserForGame",
						newPath: path.csd.sub.memberGameExclusion.root,
						pathMode: "Internal",
						element: <div>MemberGameExclusion</div>,
						childs: null
					},
					{
						displayKey: "Menu.CSD.Label_UserBetLimit",
						allowedRole: allowedRoles.CustManageUserBetLimit,
						oldPath: "CustManage/UserBetLimit",
						newPath: path.csd.sub.userBetLimit.root,
						pathMode: "Internal",
						element: <div>userBetLimit</div>,
						childs: null
					}
				]
			}
		]
	},
	{
		icon: <EditOutlined style={iconStyle} />,
		displayKey: "Menu.Content.Label_Content",
		menuKey: "Content",
		childs: [
			{
				displayKey: "Menu.Content.Label_Announcement",
				allowedRole: allowedRoles.MessageAnnouncement,
				oldPath: "Message/Announcement",
				newPath: path.content.sub.announcement.root,
				pathMode: "Internal",
				element: <div>announcement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_NewsManagement",
				allowedRole: allowedRoles.MarketingNewsManage,
				oldPath: "Marketing/NewsManage",
				newPath: path.content.sub.newsManage.root,
				pathMode: "Internal",
				element: <div>NewsManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_BannerManagement",
				allowedRole: allowedRoles.CMSBannerManage,
				oldPath: "Marketing/BannerManage",
				newPath: path.content.sub.bannerManage.root,
				pathMode: "Internal",
				element: <div>bannerManage</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_GameCasinoManagement",
				allowedRole: allowedRoles.CMSGameCasinoManagement,
				oldPath: "Marketing/GameCasinoManagement",
				newPath: path.content.sub.gameCasinoManagement.root,
				pathMode: "Internal",
				element: <div>gameCasinoManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_HotEventManagement",
				allowedRole: allowedRoles.CMSHotEventManagement,
				oldPath: "Marketing/HotEventManagement",
				newPath: path.content.sub.hotEventManagement.root,
				pathMode: "Internal",
				element: <div>hotEventManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_VideoManagement",
				allowedRole: allowedRoles.CMSLatestHighlightVideoManagement,
				oldPath: "Marketing/LatestHighlightVideoManagement",
				newPath: path.content.sub.videoManagement.root,
				pathMode: "Internal",
				element: <div>videoManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_DomainManagement",
				allowedRole: allowedRoles.CMSDomainManage,
				oldPath: "Marketing/DomainManage",
				newPath: path.content.sub.domainManage.root,
				pathMode: "Internal",
				element: <div>domainManage</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_GameProviderMaintenance",
				allowedRole: allowedRoles.CMSTpMaintain,
				oldPath: "Marketing/TpMaintain",
				newPath: path.content.sub.gameProviderMaintenance.root,
				pathMode: "Internal",
				element: <div>vendersMaintenance</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_LeaderBoardPointManagement",
				allowedRole: allowedRoles.CMSLeaderBoardExtraPoint,
				oldPath: "Marketing/LeaderBoardExtraPoint",
				newPath: path.content.sub.leaderBoardPointManagement.root,
				pathMode: "Internal",
				element: <div>leaderBoardPointManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_AppDownloadUrlManagement",
				allowedRole: allowedRoles.CMSAppLinkManagement,
				oldPath: "Marketing/AppLinkManagement",
				newPath: path.content.sub.appDownloadUrlManagement.root,
				pathMode: "Internal",
				element: <div>AppDownloadUrlManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_SlotGamesManagement",
				allowedRole: allowedRoles.CMSSlotGamesManagement,
				oldPath: "Marketing/SlotGamesManagement",
				newPath: path.content.sub.slotGamesManagement.root,
				pathMode: "Internal",
				element: <div>slotGamesManagement</div>,
				childs: null
			},
			{
				displayKey: "Menu.Content.Label_GameDisplayManagement",
				allowedRole: allowedRoles.CMSCategoryManagement,
				oldPath: "Marketing/CategoryManagement",
				newPath: path.content.sub.gameDisplayManagement.root,
				pathMode: "Internal",
				element: <div>gameDisplayManagement</div>,
				childs: null
			}
		]
	},
	{
		icon: <BankOutlined style={iconStyle} />,
		displayKey: "Menu.Finance.Label_Finance",
		menuKey: "Finance",
		childs: [
			{
				displayKey: "Menu.Finance.Label_DepositListing",
				allowedRole: allowedRoles.FinanceDepositList,
				oldPath: "Finance/DepositList",
				newPath: path.finance.sub.depositListing.root,
				pathMode: "Internal",
				element: <div>depositListing</div>,
				childs: null
			},
			{
				displayKey: "Menu.Finance.Label_WithdrawalListing",
				allowedRole: allowedRoles.FinanceWithdrawalList,
				oldPath: "Finance/WithdrawalList",
				newPath: path.finance.sub.withdrawalListing.root,
				pathMode: "Internal",
				element: <div>withdrawalListing</div>,
				childs: null
			},
			{
				displayKey: "Menu.Finance.Label_WithdrawalReconcile",
				allowedRole: allowedRoles.FinanceWithdrawalAccountingList,
				oldPath: "Finance/WithdrawalAccountingList",
				newPath: path.finance.sub.withdrawalReconcile.root,
				pathMode: "Internal",
				element: <div>withdrawalReconcile</div>,
				childs: null
			},
			{
				displayKey: "Menu.Finance.Label_WithdrawableAdjustment",
				allowedRole: allowedRoles.FinanceWithdrawalLimitAdjust,
				oldPath: "Finance/WithdrawalLimitAdjust",
				newPath: path.finance.sub.withdrawableAdjustment.root,
				pathMode: "Internal",
				element: <div>Withdrawable Adjustment</div>,
				childs: null
			},
			{
				displayKey: "Menu.Finance.Label_WithdrawableAdjustmentBatch",
				allowedRole: allowedRoles.FinanceBalanceAdjustmentBatch,
				oldPath: "Finance/BalanceAdjustmentBatch",
				newPath: path.finance.sub.withdrawableAdjustmentBatch.root,
				pathMode: "Internal",
				element: <div>withdrawable Adjustment Batch</div>,
				childs: null
			},
			{
				displayKey: "Menu.Finance.Label_AdjustmentListing",
				allowedRole: allowedRoles.FinancePaymentAdjustment,
				oldPath: "Finance/PaymentAdjustment",
				newPath: path.finance.sub.adjustmentListing.root,
				pathMode: "Internal",
				element: <div>Adjustment Listing</div>,
				childs: null
			},
			{
				displayKey: "Menu.Finance.Label_GameWalletAdjustment",
				allowedRole: allowedRoles.FinanceThirdPartyAdjustment,
				oldPath: "Finance/ThirdPartyAdjustment",
				newPath: path.finance.sub.gameWalletAdjustment.root,
				pathMode: "Internal",
				element: <div>Game Wallet Adjustment</div>,
				childs: null
			},
			{
				icon: null,
				displayKey: "Menu.Label_Reports",
				menuKey: "Finance.Reports",
				childs: [
					{
						displayKey: "Menu.Finance.Label_DepositTime",
						allowedRole: allowedRoles.FinanceDepositTimeReport,
						oldPath: "Finance/DepositTimeReport",
						newPath: path.finance.sub.depositTime.root,
						pathMode: "Internal",
						element: <div>deposit Time</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_WithdrawalTime",
						allowedRole: allowedRoles.FinanceWithdrawalTimeReport,
						oldPath: "Finance/WithdrawalTimeReport",
						newPath: path.finance.sub.withdrawalTime.root,
						pathMode: "Internal",
						element: <div>Label_WithdrawalTime</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_Adjustment",
						allowedRole: allowedRoles.FinanceAdjustmentReport,
						oldPath: "Finance/PaymentAdjustmentReport",
						newPath: path.finance.sub.adjustment.root,
						pathMode: "Internal",
						element: <div>Label_Adjustment</div>,
						childs: null
					}
				]
			},
			{
				icon: null,
				displayKey: "Menu.Label_Settings",
				menuKey: "Finance.Settings",
				childs: [
					{
						displayKey: "Menu.Finance.Label_BankAccount",
						allowedRole: allowedRoles.FinanceBankInfoList,
						oldPath: "Finance/BankInfoList",
						newPath: path.finance.sub.bankInfoList.root,
						pathMode: "Internal",
						element: <div>BankAccount</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_BankTransferAccount",
						allowedRole: allowedRoles.BankFinancialTransferAccountManage,
						oldPath: "BankFinancial/TransferAccountManage",
						newPath: path.finance.sub.bankTransferAccount.root,
						pathMode: "Internal",
						element: <div>BankTransferAccount</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_PaymentGateway",
						allowedRole: allowedRoles.FinancePaymentManage,
						oldPath: "Finance/PaymentManage",
						newPath: path.finance.sub.paymentGateway.root,
						pathMode: "Internal",
						element: <div>PaymentGateway</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_DepositLimit",
						allowedRole: allowedRoles.FinanceDepositLimitManage,
						oldPath: "Finance/DepositLimitManagement",
						newPath: path.finance.sub.depositLimit.root,
						pathMode: "Internal",
						element: <div>DepositLimit</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_WithdrawalLimit",
						allowedRole: allowedRoles.FinanceWithdrawalLimitManagement,
						oldPath: "Finance/WithdrawalLimitManagement",
						newPath: path.finance.sub.withdrawalLimit.root,
						pathMode: "Internal",
						element: <div>withdrawalLimit</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_CryptoWithdrawalLimit",
						allowedRole: allowedRoles.FinanceUSDTWithdrawalLimitManagement,
						oldPath: "Finance/CryptoWithdrawalLimitManagement",
						newPath: path.finance.sub.cryptoWithdrawalLimit.root,
						pathMode: "Internal",
						element: <div>CryptoWithdrawalLimit</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_AdjustmentLimit",
						allowedRole: allowedRoles.FinanceAdjustmentLimitManagement,
						oldPath: "Finance/AdjustmentLimitManagement",
						newPath: path.finance.sub.adjustmentLimit.root,
						pathMode: "Internal",
						element: <div>adjustmentLimit</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_LineChannelManagement",
						allowedRole: allowedRoles.FinanceLineChannel,
						oldPath: "Finance/LineChannel",
						newPath: path.finance.sub.lineChannelManagement.root,
						pathMode: "Internal",
						element: <div>lineChannelManagement</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_ReconciliationAccount",
						allowedRole: allowedRoles.BankFinancialTransferManage,
						oldPath: "BankFinancial/TransferManage",
						newPath: path.finance.sub.reconciliationAccount.root,
						pathMode: "Internal",
						element: <div>ReconciliationAccount</div>,
						childs: null
					},
					{
						displayKey: "Menu.Finance.Label_ReconciliationReason",
						allowedRole: allowedRoles.BankFinancialReasonManagement,
						oldPath: "BankFinancial/ReasonManagement",
						newPath: path.finance.sub.reconciliationReason.root,
						pathMode: "Internal",
						element: <div>Reconciliation Reason</div>,
						childs: null
					}
				]
			}
		]
	},
	{
		icon: <ShopOutlined style={iconStyle} />,
		displayKey: "Menu.Marketing.Label_Marketing",
		menuKey: "Marketing",
		childs: [
			{
				displayKey: "Menu.Marketing.Label_DrawPrizeReport",
				allowedRole: allowedRoles.MarketingDrawPrizeReport,
				oldPath: "Marketing/DrawPrizeReport",
				newPath: path.marketing.sub.drawPrizeReport.root,
				pathMode: "Internal",
				element: <div>DrawPrizeReport</div>,
				childs: null
			},
			{
				displayKey: "Menu.Marketing.Label_VipLevelReview",
				allowedRole: allowedRoles.MarketingVipLevelReview,
				oldPath: "Marketing/VipLevelReview",
				newPath: path.marketing.sub.vipLevelReview.root,
				pathMode: "Internal",
				element: <div>vipLevelReview</div>,
				childs: null
			},
			{
				displayKey: "Menu.Marketing.Label_BonusImport",
				allowedRole: allowedRoles.MarketingBonusImport,
				oldPath: "Marketing/BonusImport",
				newPath: path.marketing.sub.bonusImport.root,
				pathMode: "Internal",
				element: <div>BonusImport</div>,
				childs: null
			},
			{
				icon: null,
				displayKey: "Menu.Label_Bonus",
				menuKey: "Marketing.Bonus",
				childs: [
					{
						displayKey: "Menu.Marketing.Label_BonusManagement",
						allowedRole: allowedRoles.MarketingBonusManage,
						oldPath: "Marketing/BonusManage",
						newPath: path.marketing.sub.bonusManagement.root,
						pathMode: "Internal",
						element: <div>Bonus Management</div>,
						childs: null
					},
					{
						displayKey: "Menu.Marketing.Label_AppliedBonus",
						allowedRole: allowedRoles.MarketingBonusInfoReport,
						oldPath: "Marketing/BonusInfoReport",
						newPath: path.marketing.sub.appliedBonus.root,
						pathMode: "Internal",
						element: <div>AppliedBonus</div>,
						childs: null
					},
					{
						displayKey: "Menu.Marketing.Label_PendingBonus",
						allowedRole: allowedRoles.MarketingPendingBonus,
						oldPath: "Marketing/PendingBonus",
						newPath: path.marketing.sub.pendingBonus.root,
						pathMode: "Internal",
						element: <div>pendingBonus</div>,
						childs: null
					}
				]
			},
			{
				icon: null,
				displayKey: "Menu.Label_Rebate",
				menuKey: "Marketing.Rebate",
				childs: [
					{
						displayKey: "Menu.Marketing.Label_RebateInfoReport",
						allowedRole: allowedRoles.MarketingRebateInfoReport,
						oldPath: "Marketing/RebateInfoReport",
						newPath: path.marketing.sub.rebateInfoReport.root,
						pathMode: "Internal",
						element: <div>RebateInfoReport</div>,
						childs: null
					},
					{
						displayKey: "Menu.Marketing.Label_RebateReport",
						allowedRole: allowedRoles.MarketingRebateLogReport,
						oldPath: "Marketing/RebateLogReport",
						newPath: path.marketing.sub.rebateReport.root,
						pathMode: "Internal",
						element: <div>rebate report</div>,
						childs: null
					},
					{
						displayKey: "Menu.Marketing.Label_VipRebateReport",
						allowedRole: allowedRoles.MarketingVipRebateInfoReport,
						oldPath: "Marketing/VipRebateInfoReport",
						newPath: path.marketing.sub.vipRebateReport.root,
						pathMode: "Internal",
						element: <div>vipRebateReport</div>,
						childs: null
					},
					{
						displayKey: "Menu.Marketing.Label_VipRebateManagement",
						allowedRole: allowedRoles.MarketingVipRebateMangetment,
						oldPath: "Marketing/VipRebateMangetment",
						newPath: path.marketing.sub.vipRebateReport.root,
						pathMode: "Internal",
						element: <div>VipRebateManagement</div>,
						childs: null
					}
				]
			},
			{
				icon: null,
				displayKey: "Menu.Label_Referral",
				menuKey: "Marketing.Referral",
				childs: [
					{
						displayKey: "Menu.Marketing.Label_ReferralManagement",
						allowedRole: allowedRoles.MarketingReferralManagement,
						oldPath: "Marketing/ReferralManagement",
						newPath: path.marketing.sub.referralManagement.root,
						pathMode: "Internal",
						element: <div>ReferralManagement</div>,
						childs: null
					},
					{
						displayKey: "Menu.Marketing.Label_ReferralReport",
						allowedRole: allowedRoles.MarketingReferralReport,
						oldPath: "Marketing/ReferralReport",
						newPath: path.marketing.sub.referralReport.root,
						pathMode: "Internal",
						element: <div>referralReport</div>,
						childs: null
					}
				]
			},
			{
				icon: null,
				displayKey: "Menu.Label_Reward",
				menuKey: "Marketing.Reward",
				childs: [
					{
						displayKey: "Menu.Marketing.Label_VerificationReward",
						allowedRole: allowedRoles.MarketingVerificationReward,
						oldPath: "Marketing/VerificationReward",
						newPath: path.marketing.sub.verificationReward.root,
						pathMode: "Internal",
						element: <div>verificationReward</div>,
						childs: null
					},
					{
						displayKey: "Menu.Marketing.Label_VerificationRewardManagement",
						allowedRole: allowedRoles.MarketingVerificationRewardReport,
						oldPath: "Marketing/VerificationRewardReport",
						newPath: path.marketing.sub.verificationRewardManagement.root,
						pathMode: "Internal",
						element: <div>VerificationRewardManagement</div>,
						childs: null
					}
				]
			},
			{
				icon: null,
				displayKey: "Menu.Label_Settings",
				menuKey: "Marketing.Settings",
				childs: [
					{
						displayKey: "Menu.Marketing.Label_PointLevelManagement",
						allowedRole: allowedRoles.MarketingPointLevelManagement,
						oldPath: "Marketing/PointLevelManagement",
						newPath: path.marketing.sub.pointLevelManagement.root,
						pathMode: "Internal",
						element: <div>PointLevelManagement</div>,
						childs: null
					}
				]
			}
		]
	},
	{
		icon: <FaGamepad style={iconStyle} />,
		displayKey: "Menu.Game.Label_Game",
		menuKey: "Game",
		childs: [
			{
				displayKey: "Menu.Game.Label_BetFailureRecord",
				allowedRole: allowedRoles.CustManageTpFailRecordReport,
				oldPath: "CustManage/TpFailRecordReport",
				newPath: path.game.sub.betFailureRecord.root,
				pathMode: "Internal",
				element: <div>betFailureRecord</div>,
				childs: null
			}
		]
	},
	{
		icon: <BarChartOutlined style={iconStyle} />,
		displayKey: "Menu.Label_Reports",
		menuKey: "Reports",
		childs: [
			{
				displayKey: "Menu.Report.Label_MainFinancialReport",
				allowedRole: allowedRoles.ReportMainFinancialReport,
				oldPath: "Report/MainFinancialReport",
				newPath: path.report.sub.mainFinancialReport.root,
				pathMode: "Internal",
				element: <div>MainFinancialReport</div>,
				childs: null
			},
			{
				displayKey: "Menu.Report.Label_DepositReport",
				allowedRole: allowedRoles.ReportDepositReport,
				oldPath: "Report/DepositReport",
				newPath: path.report.sub.depositReport.root,
				pathMode: "Internal",
				element: <div>DepositReport</div>,
				childs: null
			},
			{
				displayKey: "Menu.Report.Label_StatisticalReport",
				allowedRole: allowedRoles.ReportStatisticalReport,
				oldPath: "Report/StatisticalReport",
				newPath: path.report.sub.statisticalReport.root,
				pathMode: "Internal",
				element: <div>StatisticalReport</div>,
				childs: null
			},
			{
				displayKey: "Menu.Report.Label_CustomerStatisticalReport",
				allowedRole: allowedRoles.ReportCustomerStatisticalReport,
				oldPath: "Report/CustomerStatisticalReport",
				newPath: path.report.sub.customerStatisticalReport.root,
				pathMode: "Internal",
				element: <div>CustomerStatisticalReport</div>,
				childs: null
			},
			{
				displayKey: "Menu.Report.Label_UserOnlineReport",
				allowedRole: allowedRoles.ReportUserOnlineReport,
				oldPath: "Report/UserOnlineReport",
				newPath: path.report.sub.userOnlineReport.root,
				pathMode: "Internal",
				element: <div>userOnlineReport</div>,
				childs: null
			},
			{
				icon: null,
				displayKey: "Menu.Label_BankTransfer",
				menuKey: "Reports.BankTransfer",
				childs: [
					{
						displayKey: "Menu.Report.Label_TransferInfoReport",
						allowedRole: allowedRoles.BankFinancialReportTransferInfoReport,
						oldPath: "BankFinancial/TransferInfoReport",
						newPath: path.report.sub.transferInfoReport.root,
						pathMode: "Internal",
						element: <div>TransferInfoReport</div>,
						childs: null
					},
					{
						displayKey: "Menu.Report.Label_BankFinancialReport",
						allowedRole: allowedRoles.BankFinancialReportBankFinancialReport,
						oldPath: "BankFinancial/BankFinancialReport",
						newPath: path.report.sub.bankFinancialReport.root,
						pathMode: "Internal",
						element: <div>bankFinancialReport</div>,
						childs: null
					}
				]
			}
		]
	},
	{
		icon: <RiUserSettingsLine style={iconStyle} />,
		displayKey: "Menu.Administration.Label_Administration",
		menuKey: "Administration",
		childs: [
			{
				displayKey: "Menu.Administration.Label_RoleSetting",
				allowedRole: allowedRoles.AdminGroupAuthoritySetting,
				oldPath: "Admin/GroupAuthoritySetting",
				newPath: path.administration.sub.roleSetting.root,
				pathMode: "Internal",
				element: <div>RoleSetting</div>,
				childs: null
			},
			{
				displayKey: "Menu.Administration.Label_UserSetting",
				allowedRole: allowedRoles.AdminUserAuthoritySetting,
				oldPath: "Admin/UserAuthoritySetting",
				newPath: path.administration.sub.userSetting.root,
				pathMode: "Internal",
				element: <div>UserSetting</div>,
				childs: null
			},
			{
				displayKey: "Menu.Administration.Label_SpecialPasswordManagement",
				allowedRole: allowedRoles.AdminSpecialPasswordManagement,
				oldPath: "Admin/SpecialPasswordManagement",
				newPath: path.administration.sub.specialPasswordManagement.root,
				pathMode: "Internal",
				element: <div>SpecialPasswordManagement</div>,
				childs: null
			},

			{
				displayKey: "Menu.Administration.Label_UserActivityLog",
				allowedRole: allowedRoles.FinanceAdjustmentLogReport,
				oldPath: "Finance/AdjustmentLogReport",
				newPath: path.administration.sub.specialPasswordManagement.root,
				pathMode: "Internal",
				element: <div>UserActivityLog</div>,
				childs: null
			}
		]
	}
];
