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
	| 'DepositStatusEnum'

export interface IGetEnumTypeArgs {
	/**
	 * @argument {string}  TransferChannelEnum - 取得渠道列表
	 * @argument {string}  TransferAccountStatusEnum - 取得帳號狀態列表
	 * @argument {string}  TransferAccountPurposeEnum - 取得目的列表
	 * @argument {string}  BankCardManagementSupportChannelEnum - 獲得渠道列表
	 * @argument {string}  BankCardManagementStatusEnum - 取得狀態列表
	 * @argument {string}  BankCardManagementPurposeEnum - 取得目的列表
	 * @argument {string}  DepositStatusEnum - 取得存款狀態列表
	 */
	enumName: EnumNameType
}
