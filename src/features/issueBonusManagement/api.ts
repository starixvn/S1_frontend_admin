import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IAdjustmentLimitResponse,
	ICheckBonusCodeResponse,
	ICheckTierRedepositBonusArgs,
	ICheckTierRedepositBonusResponse,
	ICustInfoDetailsResponse,
	ISetBonusPayoutArgs,
} from './type'

export const issueBonusManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getCustInfoDetails: builder.query<
			ICustInfoDetailsResponse,
			{ userName: string; sabaId: string; siteId: number }
		>({
			query: data => ({
				url: `CustomerManage/GetCustInfoDetails`,
				method: 'POST',
				data,
			}),
		}),
		getAdjustmentLimitInfo: builder.query<
			IAdjustmentLimitResponse,
			{ siteId: number; currencyId: number }
		>({
			query: data => ({
				url: 'BalanceAdjustment/GetAdjustmentLimitInfo',
				method: 'POST',
				data,
			}),
		}),

		checkBonusCode: builder.query<
			ICheckBonusCodeResponse,
			{
				siteId: number
				currencyId: number
				bonusCode: string
			}
		>({
			query: data => ({
				url: 'BalanceAdjustment/CheckBonusCode',
				method: 'POST',
				data,
			}),
		}),
		// * 檢查 Tier Redeposit Bonus
		checkTierRedepositBonus: builder.query<
			ICheckTierRedepositBonusResponse,
			ICheckTierRedepositBonusArgs
		>({
			query: data => ({
				url: 'BonusPayout/CheckTierRedepositBonus',
				method: 'POST',
				data,
			}),
		}),
		// * 後台手動領取Bonus
		setBonusPayout: builder.mutation<IAxiosResponse<void>, ISetBonusPayoutArgs>(
			{
				query: data => ({
					url: 'BonusPayout/SetBonusPayout',
					method: 'POST',
					data,
				}),
			}
		),
	}),
})

export const {
	useLazyGetCustInfoDetailsQuery,
	useLazyGetAdjustmentLimitInfoQuery,
	useLazyCheckBonusCodeQuery,
	useLazyCheckTierRedepositBonusQuery,
	useSetBonusPayoutMutation,
} = issueBonusManagementApi
