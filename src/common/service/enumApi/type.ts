import { IAxiosResponse } from '../axiosBaseQuery'

export interface IEnumTypeData {
	name: string
	value: number
}

export type IEnumTypeResponse = IAxiosResponse<IEnumTypeData[]>

export type EnumNameType =
	| 'TransferChannelEnum'
	| 'TransferAccountStatusEnum'
	| 'TransferAccountPurposeEnum'
	| 'BankCardManagementStatusEnum'
	| 'BankCardManagementPurposeEnum'
	| 'BankCardManagementSupportChannelEnum'
	| 'PayListMethodEnum'
	| 'PayChannelTypeEnum'
	| 'PayListStatusEnum'
	| 'PayChannelMethodEnum'
	| 'AmountRuleEnum'
	| 'DepositStatusEnum'
	| 'DepositTypeEnum'
	| 'WithdrawalStatusEnum'
	| 'WithdrawalTypeEnum'
	| 'TransferStatusEnum'
	| 'TransferTypeEnum'
	| 'AdjustmentInfoStatusEnum'
	| 'AdjustTypeEnum'
	| 'CustBankInfoLogStatus'
	| 'EWalletinfoLogStatusEnum'
	| 'WithdrawalLimitLogMainTypeEnum'
	| 'FinancialType'
	| 'OTPProvider'
	| 'OTPStatus'
	| 'BonusAtPageEnum'
	| 'BannerTypeEnum'
	| 'BannerActionModeEnum'
	| 'ShowStatusEnum'
	| 'UrlRouterEnum'
	| 'DeepLinkTableTypeEnum'
	| 'DeepLinkTableProtocolTypeEnum'

export interface IGetEnumTypeArgs {
	/**
	 * @argument {string}  TransferChannelEnum - 取得渠道列表
	 * @argument {string}  TransferAccountStatusEnum - 取得帳號狀態列表
	 * @argument {string}  TransferAccountPurposeEnum - 取得目的列表
	 * @argument {string}  BankCardManagementSupportChannelEnum - 獲得渠道列表
	 * @argument {string}  BankCardManagementStatusEnum - 取得狀態列表
	 * @argument {string}  BankCardManagementPurposeEnum - 取得目的列表
	 * @argument {string}  DepositStatusEnum - 取得存款狀態列表
	 * @argument {string}  DepositTypeEnum - 取得存款種類列表
	 * @argument {string}  WithdrawalStatusEnum - 取得取款狀態列表
	 * @argument {string}  WithdrawalTypeEnum - 取得取款種類列表
	 * @argument {string}  TransferStatusEnum - 取得交易狀態列表
	 * @argument {string}  TransferTypeEnum - 取得交易種類列表
	 * @argument {string}  AdjustmentInfoStatusEnum - 取得調整狀態列表
	 * @argument {string}  AdjustTypeEnum - 取得調整種類列表
	 * @argument {string}  CustBankInfoLogStatus - 取得銀行狀態列表
	 * @argument {string}  EWalletinfoLogStatusEnum - 取得電子錢包狀態列表
	 * @argument {string}  WithdrawalLimitLogMainTypeEnum - 取得取款限制種類列表
	 * @argument {string}  FinancialType - 取得財務種類列表
	 * @argument {string}  PayListMethodEnum - 取得 PayList Method 列表
	 * @argument {string}  PayChannelTypeEnum - 取得 Payment Type 列表
	 * @argument {string}  PayListStatusEnum - 取得 GlobalStatus 列表
	 * @argument {string}  PayChannelMethodEnum - 取得 ChannelMethod 列表
	 * @argument {string}  AmountRuleEnum - 取得 AmountRule 列表
	 * @argument {string}  OTPProvider - 取得 OTP 種類列表
	 * @argument {string}  OTPStatus - 取得 OTP 狀態列表
	 * @argument {string}  BonusAtPageEnum - 取得 AtPage 列表
	 * @argument {string}  DeepLinkTableTypeEnum - 取得DeepLink Type清單
	 * @argument {string}  DeepLinkTableProtocolTypeEnum - 取得DeepLink ProtocolType清單
	 */
	enumName: EnumNameType
}
