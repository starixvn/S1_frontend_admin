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
			/* webpackChunkName: 'DepositPoint' */ 'features/depositPoint/DepositPoint'
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
			/* webpackChunkName: 'GiftListing' */ 'features/giftListing/GiftListing'
		)
)

const AddGiftListing = lazy(
	() =>
		import(
			/* webpackChunkName: 'AddGiftListing' */ 'features/giftListing/AddGiftListing'
		)
)

const EditGiftListing = lazy(
	() =>
		import(
			/* webpackChunkName: 'EditGiftListing' */ 'features/giftListing/EditGiftListing'
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

const DepositOperator = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositOperator' */ 'features/depositOperator/DepositOperator'
		)
)

const DepositRequest = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositRequest' */ 'features/depositOperator/depositRequest/DepositRequest'
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

const OtpVerificationReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'OtpVerificationReport' */ 'features/otpVerificationReport/OtpVerificationReport'
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

const VipRebateReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'VipRebateReport' */ 'features/vipRebateReport/VipRebateReport'
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

const MemberAdministrationList = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberAdministrationList' */ 'features/memberAdministrationList/MemberAdministrationList'
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

const MemberProfileFinanceWithdrawalInfo = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/withdrawalInfo/WithdrawalInfo'
		)
)

const MemberProfileFinanceAdjustmentInfo = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/adjustmentInfo/AdjustmentInfo'
		)
)

const MemberProfileFinanceThirdPartyAdjustmentInfo = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/thirdPartyAdjustmentInfo/ThirdPartyAdjustmentInfo'
		)
)

const MemberProfileFinanceWithdrawalLimitLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/withdrawalLimitLog/WithdrawalLimitLog'
		)
)

const MemberProfileFinanceTransferInfo = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/transferInfo/TransferInfo'
		)
)

const MemberProfileFinanceFinancialLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/financialLog/FinancialLog'
		)
)

const MemberProfileBankInfoLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/bankInfoLog/BankInfoLog'
		)
)

const MemberProfileEWalletInfoLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/eWalletInfoLog/EWalletInfoLog'
		)
)

const MemberProfileCryptoInfoLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/cryptoInfoLog/CryptoInfoLog'
		)
)

const MemberProfileBankList = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/bankList/BankList'
		)
)

const MemberProfileEWalletList = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/eWalletList/EWalletList'
		)
)

const MemberProfileCryptoWalletList = lazy(
	() =>
		import(
			/* webpackChunkName: 'MemberProfile' */ 'features/memberProfile/pages/finance/cryptoWalletList/CryptoWalletList'
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

const MemberProfileBonusLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'BonusLog' */ 'features/memberProfile/pages/marketing/bonusLog/BonusLog'
		)
)

const MemberProfileVipRebateLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'VipRebateLog' */ 'features/memberProfile/pages/marketing/vipRebateLog/VipRebateLog'
		)
)

const MemberProfileRewardPointLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'RewardPointLog' */ 'features/memberProfile/pages/marketing/rewardPointLog/RewardPointLog'
		)
)

const MemberProfilePromotionReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'PromotionReport' */ 'features/memberProfile/pages/marketing/promotionReport/PromotionReport'
		)
)

const MemberProfilePromotionFailLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'PromotionFailLog' */ 'features/memberProfile/pages/marketing/promotionFailLog/PromotionFailLog'
		)
)

const MemberProfileThirdPartyAccounts = lazy(
	() =>
		import(
			/* webpackChunkName: 'ThirdPartyAccounts' */ 'features/memberProfile/pages/game/thirdPartyAccounts/ThirdPartyAccounts'
		)
)

const MemberProfileTurnover = lazy(
	() =>
		import(
			/* webpackChunkName: 'Turnover' */ 'features/memberProfile/pages/game/turnover/Turnover'
		)
)

const MemberProfileWinLossSummary = lazy(
	() =>
		import(
			/* webpackChunkName: 'WinLossSummary' */ 'features/memberProfile/pages/game/winLossSummary/WinLossSummary'
		)
)

const MemberProfileCashBackReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'CashBackReport' */ 'features/memberProfile/pages/marketing/cashBackReport/CashBackReport'
		)
)

const PaymentManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'PaymentManagement' */ 'features/paymentManagement/PaymentManagement'
		)
)

const PaymentAdjustment = lazy(
	() =>
		import(
			/* webpackChunkName: 'PaymentAdjustment' */ 'features/paymentAdjustment/PaymentAdjustment'
		)
)

const ExchangeUsdRate = lazy(
	() =>
		import(
			/* webpackChunkName: 'ExchangeUsdRate' */ 'features/exchangeUsdRate/ExchangeUsdRate'
		)
)

const BettingMonitorSetting = lazy(
	() =>
		import(
			/* webpackChunkName: 'BettingMonitorSetting' */ 'features/bettingMonitorSetting/BettingMonitorSetting'
		)
)

const BannerManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'BannerManagement' */ 'features/bannerManagement/BannerManagement'
		)
)

const DepositTimeReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositTimeReport' */ 'features/depositTimeReport/DepositTimeReport'
		)
)

const DepositSubmission = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositSubmission' */ 'features/depositSubmission/DepositSubmission'
		)
)

const DrawPrizeReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'DrawPrizeReport' */ 'features/drawPrizeReport/DrawPrizeReport'
		)
)

const BankFinancialReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'BankFinancialReport' */ 'features/bankFinancialReport/BankFinancialReport'
		)
)

const GameStatisticalReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'GameStatisticalReport' */ 'features/gameStatisticalReport/GameStatisticalReport'
		)
)

const ProviderAppDownload = lazy(
	() =>
		import(
			/* webpackChunkName: 'ProviderAppDownload' */ 'features/providerAppDownload/ProviderAppDownload'
		)
)

const WithdrawalOperator = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalOperator' */ 'features/withdrawalOperator/WithdrawalOperator'
		)
)

const WithdrawalRequest = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalRequest' */ 'features/withdrawalOperator/withdrawalRequest/WithdrawalRequest'
		)
)

const AppQrCode = lazy(
	() =>
		import(/* webpackChunkName: 'AppQrCode' */ 'features/appQrCode/AppQrCode')
)

const PointLevelManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'pointLevelManagement' */ 'features/pointLevelManagement/PointLevelManagement'
		)
)

const VerificationReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'VerificationReport' */ 'features/verificationReport/VerificationReport'
		)
)

const ExternalDomain = lazy(
	() =>
		import(
			/* webpackChunkName: 'ExternalDomain' */ 'features/externalDomain/ExternalDomain'
		)
)

const ShieldTaggingReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'ShieldTaggingReport' */ 'features/shieldTaggingReport/ShieldTaggingReport'
		)
)

const TagManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'TagManagement' */ 'features/tagManagement/TagManagement'
		)
)

const UserOnlineReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'UserOnlineReport' */ 'features/userOnlineReport/UserOnlineReport'
		)
)

const WithdrawalTimeReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalTimeReport' */ 'features/withdrawalTimeReport/WithdrawalTimeReport'
		)
)

const HotGameManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'HotGameManagement' */ 'features/hotGameManagement/HotGameManagement'
		)
)

const DepositPaymentReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositPaymentReport' */ 'features/depositPaymentReport/DepositPaymentReport'
		)
)

const WithdrawalPaymentReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalPaymentReport' */ 'features/withdrawalPaymentReport/WithdrawalPaymentReport'
		)
)

const Iovation = lazy(
	() => import(/* webpackChunkName: 'Iovation' */ 'features/iovation/Iovation')
)

const SmsGenerator = lazy(
	() =>
		import(
			/* webpackChunkName: 'SmsGenerator' */ 'features/smsGenerator/SmsGenerator'
		)
)

const MpaMarketing = lazy(
	() =>
		import(
			/* webpackChunkName: 'MpaMarketing' */ 'features/marketing/Marketing'
		)
)

// *  marketing > DepositAmount 列表
const DepositAmount = lazy(
	() =>
		import(
			/* webpackChunkName: 'DepositAmount' */ 'features/marketing/depositAmount/DepositAmount'
		)
)

// *  marketing > WithdrawalAmount 列表
const WithdrawalAmount = lazy(
	() =>
		import(
			/* webpackChunkName: 'WithdrawalAmount' */ 'features/marketing/withdrawalAmount/WithdrawalAmount'
		)
)

// *  marketing > NRU 列表
const Nru = lazy(
	() => import(/* webpackChunkName: 'Nru' */ 'features/marketing/nru/Nru')
)

// *  marketing > BonusAmountClaimed 列表
const BonusAmountClaimed = lazy(
	() =>
		import(
			/* webpackChunkName: 'BonusAmountClaimed' */ 'features/marketing/bonusAmountClaimed/BonusAmountClaimed'
		)
)

const ProductMaintenance = lazy(
	() =>
		import(
			/* webpackChunkName: 'ProductMaintenance' */ 'features/productMaintenance/ProductMaintenance'
		)
)

const BetLimit = lazy(
	() => import(/* webpackChunkName: 'BetLimit' */ 'features/betLimit/BetLimit')
)

const VideoManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'VideoManagement' */ 'features/videoManagement/VideoManagement'
		)
)

const NewsManagement = lazy(
	() =>
		import(
			/* webpackChunkName: 'NewsManagement' */ 'features/newsManagement/NewsManagement'
		)
)

const FailBet = lazy(
	() => import(/* webpackChunkName: 'FailBet' */ 'features/failBet/FailBet')
)

const VipReview = lazy(
	() =>
		import(/* webpackChunkName: 'VipReview' */ 'features/vipReview/VipReview')
)

const Announcement = lazy(
	() =>
		import(
			/* webpackChunkName: 'Announcement' */ 'features/announcement/Announcement'
		)
)

const ModifyPaymentFeeLog = lazy(
	() =>
		import(
			/* webpackChunkName: 'ModifyPaymentFeeLog' */ 'features/modifyPaymentFeeLog/ModifyPaymentFeeLog'
		)
)

const PendingBonus = lazy(
	() =>
		import(
			/* webpackChunkName: 'PendingBonus' */ 'features/pendingBonus/PendingBonus'
		)
)

const GameExclusion = lazy(
	() =>
		import(
			/* webpackChunkName: 'GameExclusion' */ 'features/gameExclusion/GameExclusion'
		)
)

const EditGameExclusion = lazy(
	() =>
		import(
			/* webpackChunkName: 'EditGameExclusion' */ 'features/gameExclusion/editGameExclusion/EditGameExclusion'
		)
)

const BonusInfo = lazy(
	() =>
		import(/* webpackChunkName: 'BonusInfo' */ 'features/bonusInfo/BonusInfo')
)

const WinLostReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'WinLostReport' */ 'features/winLostReport/WinLostReport'
		)
)

const BatchMemberInfoReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'BatchMemberInfoReport' */ 'features/batchMemberInfoReport/BatchMemberInfoReport'
		)
)

const BlockCryptoWallet = lazy(
	() =>
		import(
			/* webpackChunkName: 'BlockCryptoWallet' */ 'features/blockCryptoWallet/BlockCryptoWallet'
		)
)

const LeaderboardExtraPoint = lazy(
	() =>
		import(
			/* webpackChunkName: 'LeaderboardExtraPoint' */ 'features/leaderboardExtraPoint/LeaderboardExtraPoint'
		)
)
const LeaderboardReport = lazy(
	() =>
		import(
			/* webpackChunkName: 'LeaderboardReport' */ 'features/leaderboardReport/LeaderboardReport'
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
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.depositOperator.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.depositWithdrawalSector.sub.depositOperator
								.functionId
						}
					>
						<DepositOperator />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.depositOperator.root}/:transId`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.depositWithdrawalSector.sub.depositOperator
								.functionId
						}
					>
						<DepositRequest />
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
				path: `${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.operatorService.sub.otpVerificationReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.customerSupport.sub.operatorService.sub
								.otpVerificationReport.functionId
						}
					>
						<OtpVerificationReport />
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
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.vipRebateReport.root}`,
				element: (
					<AuthRequire functionId={paths.report.sub.vipRebateReport.functionId}>
						<VipRebateReport />
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
				path: `${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministrationList.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.customerSupport.sub.memberAdministrationList.functionId
						}
					>
						<MemberAdministrationList />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}`,
				element: (
					<AuthRequire functionId={paths.memberProfile.functionId}>
						<MemberProfile />
					</AuthRequire>
				),
				// * children 的 AuthRequire 皆需要帶入 memberProfile 的 memberProfile
				// * 因為每頁都有可能綁權限，如果不帶的話會拿不到來自 memberProfile 的所有權限
				children: [
					{
						path: 'dashboard/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileDashboard />
							</AuthRequire>
						),
					},
					// * CustomerInfo 類別
					{
						path: 'customerInfo/memberFlowLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileCustomerInfoMemberFlowLog />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/vipLevel/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileVipLevelLog />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/referralHistory/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileReferralHistory />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/notes/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileNotes />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/SMSInfo/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileSmsInfo />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/loginLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileLoginLog />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/deviceList/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileDeviceList />
							</AuthRequire>
						),
					},
					{
						path: 'customerInfo/ipLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileIpList />
							</AuthRequire>
						),
					},

					// * Finance 類別
					{
						path: 'finance/depositInfo/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileFinanceDepositInfo />
							</AuthRequire>
						),
					},
					{
						path: 'finance/withdrawalInfo/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileFinanceWithdrawalInfo />
							</AuthRequire>
						),
					},
					{
						path: 'finance/adjustmentInfo/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileFinanceAdjustmentInfo />
							</AuthRequire>
						),
					},
					{
						path: 'finance/3RDPartyAdjustmentInfo/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileFinanceThirdPartyAdjustmentInfo />
							</AuthRequire>
						),
					},
					{
						path: 'finance/withdrawalLimitLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileFinanceWithdrawalLimitLog />
							</AuthRequire>
						),
					},
					{
						path: 'finance/transferInfo/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileFinanceTransferInfo />
							</AuthRequire>
						),
					},
					{
						path: 'finance/financialLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileFinanceFinancialLog />
							</AuthRequire>
						),
					},
					{
						path: 'finance/bankInfoLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileBankInfoLog />
							</AuthRequire>
						),
					},
					{
						path: 'finance/eWalletInfoLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileEWalletInfoLog />
							</AuthRequire>
						),
					},
					{
						path: 'finance/cryptoInfoLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileCryptoInfoLog />
							</AuthRequire>
						),
					},
					{
						path: 'finance/bankList/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileBankList />
							</AuthRequire>
						),
					},
					{
						path: 'finance/eWalletList/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileEWalletList />
							</AuthRequire>
						),
					},
					{
						path: 'finance/cryptoWalletList/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileCryptoWalletList />
							</AuthRequire>
						),
					},
					// * Game 類別
					{
						path: 'game/statement/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileGameStatement />
							</AuthRequire>
						),
					},
					{
						path: 'game/3RDPartyAccount/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileThirdPartyAccounts />
							</AuthRequire>
						),
					},
					{
						path: 'game/winLoseSummary/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileWinLossSummary />
							</AuthRequire>
						),
					},
					{
						path: 'game/turnover/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileTurnover />
							</AuthRequire>
						),
					},
					// * marketing 類別
					{
						path: 'marketing/bonusWallet/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileMarketingBonusWallet />
							</AuthRequire>
						),
					},
					{
						path: 'marketing/bonusLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileBonusLog />
							</AuthRequire>
						),
					},
					{
						path: 'marketing/vipRebateLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileVipRebateLog />
							</AuthRequire>
						),
					},
					{
						path: 'marketing/rewardsPointLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileRewardPointLog />
							</AuthRequire>
						),
					},
					{
						path: 'marketing/promotionReport/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfilePromotionReport />
							</AuthRequire>
						),
					},
					{
						path: 'marketing/promotionFailLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfilePromotionFailLog />
							</AuthRequire>
						),
					},
					{
						path: 'marketing/cashBackReport/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileCashBackReport />
							</AuthRequire>
						),
					},
					{
						path: 'setting/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								<MemberProfileSetting />
							</AuthRequire>
						),
					},
					{
						path: 'adminUserLog/:custId',
						element: (
							<AuthRequire functionId={paths.memberProfile.functionId}>
								{/* TODO: */}
								<MemberProfileAdminUserLog />
							</AuthRequire>
						),
					},
				],
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.paymentGateway.root}`,
				element: (
					<AuthRequire functionId={paths.finance.sub.paymentGateway.functionId}>
						<PaymentManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.withdrawalOperator.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.depositWithdrawalSector.sub.withdrawalOperator
								.functionId
						}
					>
						<WithdrawalOperator />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.withdrawalOperator.root}/:transId`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.depositWithdrawalSector.sub.withdrawalOperator
								.functionId
						}
					>
						<WithdrawalRequest />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.report.sub.paymentAdjustment.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.report.sub.paymentAdjustment.functionId
						}
					>
						<PaymentAdjustment />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.systemSetting.sub.exchangeUsdRate.root}`,
				element: (
					<AuthRequire
						functionId={paths.systemSetting.sub.exchangeUsdRate.functionId}
					>
						<ExchangeUsdRate />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.systemSetting.sub.bettingMonitorSetting.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.systemSetting.sub.bettingMonitorSetting.functionId
						}
					>
						<BettingMonitorSetting />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.bannerManage.root}`,
				element: (
					<AuthRequire functionId={paths.cms.sub.bannerManage.functionId}>
						<BannerManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.depositSubmission.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.depositWithdrawalSector.sub.depositSubmission
								.functionId
						}
					>
						<DepositSubmission />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.bankFinancialReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.bankTransfer.sub.bankFinancialReport.functionId}
					>
						<BankFinancialReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.drawPrizeReport.root}`,
				element: (
					<AuthRequire functionId={paths.report.sub.drawPrizeReport.functionId}>
						<DrawPrizeReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.gameStatisticalReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.gameStatisticalReport.functionId}
					>
						<GameStatisticalReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.urlManagement.sub.providerAppDownload.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.cms.sub.urlManagement.sub.providerAppDownload.functionId
						}
					>
						<ProviderAppDownload />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.report.sub.depositTimeReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.report.sub.depositTimeReport.functionId
						}
					>
						<DepositTimeReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.urlManagement.sub.appQrCode.root}`,
				element: (
					<AuthRequire
						functionId={paths.cms.sub.urlManagement.sub.appQrCode.functionId}
					>
						<AppQrCode />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.pointLevelManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.pointLevelManagement.functionId}
					>
						<PointLevelManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.verificationReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.verificationReport.functionId}
					>
						<VerificationReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.urlManagement.sub.externalDomain.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.cms.sub.urlManagement.sub.externalDomain.functionId
						}
					>
						<ExternalDomain />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.userOnlineReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.userOnlineReport.functionId}
					>
						<UserOnlineReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.report.sub.withdrawalTimeReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.report.sub.withdrawalTimeReport.functionId
						}
					>
						<WithdrawalTimeReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.tagManagement.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.tagManagement.functionId}>
						<TagManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.depositPaymentReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.depositPaymentReport.functionId}
					>
						<DepositPaymentReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.withdrawalPaymentReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.withdrawalPaymentReport.functionId}
					>
						<WithdrawalPaymentReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.hotGameManagement.root}`,
				element: (
					<AuthRequire functionId={paths.cms.sub.hotGameManagement.functionId}>
						<HotGameManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.shieldTaggingReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.member.sub.shieldTaggingReport.functionId}
					>
						<ShieldTaggingReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.announcement.root}`,
				element: (
					<AuthRequire functionId={paths.cms.sub.announcement.functionId}>
						<Announcement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.tagManagement.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.tagManagement.functionId}>
						<TagManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.operatorService.sub.smsGenerator.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.customerSupport.sub.operatorService.sub.smsGenerator
								.functionId
						}
					>
						<SmsGenerator />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.mpaMarketingReport.functionId}
					>
						<MpaMarketing />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.sub.depositAmount.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.mpaMarketingReport.functionId}
					>
						<DepositAmount />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.sub.withdrawalAmount.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.mpaMarketingReport.functionId}
					>
						<WithdrawalAmount />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.sub.nru.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.mpaMarketingReport.functionId}
					>
						<Nru />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.sub.bonusClaimedInfo.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.mpaMarketingReport.functionId}
					>
						<BonusAmountClaimed />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.productManagement.sub.maintenance.root}`,
				element: (
					<AuthRequire
						functionId={paths.productManagement.sub.maintenance.functionId}
					>
						<ProductMaintenance />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.vipReview.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.vipReview.functionId}>
						<VipReview />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.modifyPaymentFeeLog.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.setting.sub.modifyPaymentFeeLog.functionId
						}
					>
						<ModifyPaymentFeeLog />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.content.sub.videoManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.content.sub.videoManagement.functionId}
					>
						<VideoManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.iovation.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.iovation.functionId}>
						<Iovation />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.productManagement.sub.maintenance.root}`,
				element: (
					<AuthRequire
						functionId={paths.productManagement.sub.maintenance.functionId}
					>
						<ProductMaintenance />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.betLimit.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.betLimit.functionId}>
						<BetLimit />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.gameExclusion.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.gameExclusion.functionId}>
						<GameExclusion />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.gameExclusion.root}/:custId`,
				element: (
					<AuthRequire functionId={paths.member.sub.gameExclusion.functionId}>
						<EditGameExclusion />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.content.sub.newsManage.root}`,
				element: (
					<AuthRequire functionId={paths.content.sub.newsManage.functionId}>
						<NewsManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.betLimit.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.betLimit.functionId}>
						<BetLimit />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.csd.sub.tpFailRecordReport.root}`,
				element: (
					<AuthRequire functionId={paths.csd.sub.tpFailRecordReport.functionId}>
						<FailBet />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.bonus.sub.pendingBonus.root}`,
				element: (
					<AuthRequire
						functionId={paths.marketing.sub.bonus.sub.pendingBonus.functionId}
					>
						<PendingBonus />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.risk.sub.blockCryptoWallet.root}`,
				element: (
					<AuthRequire functionId={paths.risk.sub.blockCryptoWallet.functionId}>
						<BlockCryptoWallet />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.batchMemberInfoReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.customerSupport.sub.batchMemberInfoReport.functionId
						}
					>
						<BatchMemberInfoReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.risk.sub.blockCryptoWallet.root}`,
				element: (
					<AuthRequire functionId={paths.risk.sub.blockCryptoWallet.functionId}>
						<BlockCryptoWallet />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.winLostReport.root}`,
				element: (
					<AuthRequire functionId={paths.report.sub.winLostReport.functionId}>
						<WinLostReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.content.sub.videoManagement.root}`,
				element: (
					<AuthRequire
						functionId={paths.content.sub.videoManagement.functionId}
					>
						<VideoManagement />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.finance.sub.setting.sub.modifyPaymentFeeLog.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.finance.sub.setting.sub.modifyPaymentFeeLog.functionId
						}
					>
						<ModifyPaymentFeeLog />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.vipReview.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.vipReview.functionId}>
						<VipReview />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.csd.sub.tpFailRecordReport.root}`,
				element: (
					<AuthRequire functionId={paths.csd.sub.tpFailRecordReport.functionId}>
						<FailBet />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.iovation.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.iovation.functionId}>
						<Iovation />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.gameExclusion.root}`,
				element: (
					<AuthRequire functionId={paths.member.sub.gameExclusion.functionId}>
						<GameExclusion />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.member.sub.gameExclusion.root}/:custId`,
				element: (
					<AuthRequire functionId={paths.member.sub.gameExclusion.functionId}>
						<EditGameExclusion />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.productManagement.sub.maintenance.root}`,
				element: (
					<AuthRequire
						functionId={paths.productManagement.sub.maintenance.functionId}
					>
						<ProductMaintenance />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.bonusInfoReport.root}`,
				element: (
					<AuthRequire functionId={paths.report.sub.bonusInfoReport.functionId}>
						<BonusInfo />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.batchMemberInfoReport.root}`,
				element: (
					<AuthRequire
						functionId={
							paths.customerSupport.sub.batchMemberInfoReport.functionId
						}
					>
						<BatchMemberInfoReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.risk.sub.blockCryptoWallet.root}`,
				element: (
					<AuthRequire functionId={paths.risk.sub.blockCryptoWallet.functionId}>
						<BlockCryptoWallet />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.report.sub.leaderboardReport.root}`,
				element: (
					<AuthRequire
						functionId={paths.report.sub.leaderboardReport.functionId}
					>
						<LeaderboardReport />
					</AuthRequire>
				),
			},
			{
				path: `${NEW_SITE_PREFIX_URL}/${paths.cms.sub.leaderboardExtraPoint.root}`,
				element: (
					<AuthRequire
						functionId={paths.cms.sub.leaderboardExtraPoint.functionId}
					>
						<LeaderboardExtraPoint />
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
