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

export interface IGetEnumTypeArgs {
	/**
	 * @argument {string}  TransferChannelEnum - 取得渠道列表
	 * @argument {string}  TransferAccountStatusEnum - 取得帳號狀態列表
	 * @argument {string}  TransferAccountPurposeEnum - 取得目的列表
	 */
	enumName: EnumNameType
}
